export class JwtUser {
    id: number;
    username: string;
    role: string;
    pfp?: string;
    email: string;
    provider?: string;
    accountConfirmed: boolean = false;
    acceptedTermsAndConditions: boolean;
    createdAt: Date;
}