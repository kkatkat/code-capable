export type User = {
    id: number;
    email: string;
    username: string;
    role: string;
    pfp?: string;
    provider?: string;
    accountConfirmed?: boolean;
    acceptedTermsAndConditions: boolean;
    bio?: string;
    createdAt: Date;
}