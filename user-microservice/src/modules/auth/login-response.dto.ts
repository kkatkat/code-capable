import { User } from "../user/user.entity";


export class LoginResponse {
    user: User;
    accessToken: string;
}