import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export const userFields = ["id", "email", "password", "username", "role", "pfp", "provider", "accountConfirmed", "acceptedTermsAndConditions", "confirmationCode", "createdAt", "bio", "gitHubUsername", "linkedInUsername"];

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    email: string;

    @Column({
        select: false,
        nullable: true,
    })
    password?: string;

    @Column({
        unique: true,
    })
    username: string;

    @Column()
    role: string;

    @Column({
        nullable: true,
    })
    pfp?: string;

    @Column({
        nullable: true,
    })
    provider?: string;

    @Column({
        default: false,
        nullable: true,
    })
    accountConfirmed?: boolean;

    @Column({
        default: false,
    })
    acceptedTermsAndConditions: boolean;

    @Column({
        select: false,
        nullable: true,
    })
    confirmationCode?: string;

    @Column({
        type: 'varchar',
        length: 1000,
        nullable: true,
    })
    bio?: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        nullable: true
    })
    gitHubUsername?: string;

    @Column({
        nullable: true
    })
    linkedInUsername?: string;
}