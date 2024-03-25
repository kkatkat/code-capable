import { Problem } from "./problem";


export type Solution = {
    id: number;
    userId: number;
    userName: string;
    code: string;
    problemId: number;
    createdAt: Date;
    problem?: Problem;
}