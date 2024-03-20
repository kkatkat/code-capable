import { ImATeapotException, Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { ServiceFactory } from "../factory/service-factory.service";
import { LoginResponse } from "./login-response.dto";

type GitHubTokenResponse = {
    access_token: string;
    token_type: 'bearer' | string;
    scope: string;
    error?: string;
    error_description?: string;
}

type GitHubUserData = {
    login: string;
    avatar_url: string;
    email: string;
}

@Injectable()
export class GitHubService {

    private GITHUB_TOKEN_ENDPOINT;
    private GITHUB_API_USER_ENDPOINT;
    private GITHUB_API_USER_EMAIL_ENDPOINT;
    
    constructor(
        private readonly config: ConfigService, 
        @Inject(forwardRef(() => ServiceFactory)) private readonly sf: ServiceFactory
        ) {
        this.GITHUB_TOKEN_ENDPOINT = 'https://github.com/login/oauth/access_token';
        this.GITHUB_API_USER_ENDPOINT = 'https://api.github.com/user';
        this.GITHUB_API_USER_EMAIL_ENDPOINT = 'https://api.github.com/user/emails'
    }

    async doGitHubSignIn(code: string): Promise<LoginResponse> {
        const token = await this.getAccessToken(code);
        const userData = await this.getUserData(token);
        
        let user = await this.sf.userService.findOne({
            where: {
                email: userData.email,
                username: userData.login,
            }
        })

        if (!user) {
            const newUser = await this.sf.userService.create({
                username: userData.login,
                email: userData.email,
                password: null,
                provider: 'github',
                pfp: userData.avatar_url,
                acceptedTermsAndConditions: true,
                accountConfirmed: true
            })

            user = newUser;
        }

        const accessToken = this.sf.authService.signJwt(user);

        delete user.password;
        delete user.confirmationCode;

        return {
            user,
            accessToken
        }

    }

    private async getAccessToken(code: string) {
        const request = {
            client_id: this.config.get('gitHubClientId'),
            client_secret: this.config.get('gitHubClientSecret'),
            code,
        }

        const headers = {
            'Accept': 'application/json'
        }

        const token: GitHubTokenResponse = await axios.post(this.GITHUB_TOKEN_ENDPOINT, request, {headers}).then((res) => res.data as GitHubTokenResponse).catch(() => {return null})

        if (!token || token.error) {
            throw new UnauthorizedException(token.error_description ?? 'Failed to get GitHub access token.');
        }

        return token;
    }

    private async getUserData(token: GitHubTokenResponse) {
        const headers = {
            'Authorization': `Bearer ${token.access_token}`
        }

        const userData = await axios.get(this.GITHUB_API_USER_ENDPOINT, {headers}).then((res) => res.data).catch(() => { return null});
        const userEmails: any[] = await axios.get(this.GITHUB_API_USER_EMAIL_ENDPOINT, {headers}).then((res) => res.data).catch(() => { return null });

        if (!userData || !userEmails || (userEmails as any).error || userData.error) {
            throw new UnauthorizedException('There was an error getting your data from GitHub. Please try again.');
        }

        const primaryEmail = userEmails.filter((email) => email.primary === true)[0];

        userData['email'] = primaryEmail.email;

        return userData as GitHubUserData;
    }

}