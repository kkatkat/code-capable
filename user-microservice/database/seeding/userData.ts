import { User } from "src/modules/user/user.entity";

const hashedPassword = '$2b$10$zakYrSh0.1LvJNaetYlkA.5sitB5HUk7HkDLlUhbJdT2b2bvAweHm';

export const userData: Partial<User>[] = [
    {
        id: 1,
        email: 'obama@example.com',
        password: hashedPassword,
        username: 'Obama',
        role: 'user',
        acceptedTermsAndConditions: true,
    },
    {
        id: 2,
        email: 'trump@example.com',
        password: hashedPassword,
        username: 'Trump',
        role: 'user',
        acceptedTermsAndConditions: true,
    },
    {
        id: 3,
        email: 'biden@example.com',
        password: hashedPassword,
        username: 'Biden',
        role: 'user',
        acceptedTermsAndConditions: true,
    },
    {
        id: 4,
        email: 'bush@example.com',
        password: hashedPassword,
        username: 'Bush',
        role: 'user',
        acceptedTermsAndConditions: true,
    },
    {
        id: 5,
        email: 'clinton@example.com',
        password: hashedPassword,
        username: 'Clinton',
        role: 'user',
        acceptedTermsAndConditions: true,
    },
    {
        id: 6,
        email: 'washington@example.com',
        password: hashedPassword,
        username: 'Washington',
        role: 'user',
        acceptedTermsAndConditions: true,
    },
    {
        id: 7,
        email: 'kiril@kat.nz',
        password: hashedPassword,
        username: 'kiril',
        role: 'admin',
        acceptedTermsAndConditions: true,
        accountConfirmed: true,
    }
]