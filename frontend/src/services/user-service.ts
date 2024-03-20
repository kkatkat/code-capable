import axios from "../config/axiosConfig";
import { User } from "../entities/user";

export type LoginResponse = {
    user: User;
    accessToken: string;
}

export type RegisterRequest = {
    username?: string;
    email?: string;
    password?: string;
    acceptedTermsAndConditions?: boolean;
}


export function login(request: {username: string, password: string}) {
    return axios.post('/u/auth/login', request).then((res: {data: LoginResponse}) => res.data);
}

export function checkToken() {
    return axios.post('/u/auth/check-token').then((res: {data: {user: User}}) => res.data);
}

export function register( request: RegisterRequest) {
    return axios.post('/u/auth/register', request).then(() => null);
}

export function getUserById(id: number) {
    return axios.get(`/u/user/${id}`).then((res) => res.data as User)
}

export function gitHubLogin(code: string) {
    return axios.post(`/u/auth/github/token/${code}`).then((res) => res.data)
}