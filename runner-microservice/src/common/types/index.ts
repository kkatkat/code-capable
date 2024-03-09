export type Problem = {
    id: number;
    name: string;
    description: string;
    starterCode: string;
    constraints?: string;
    approved: boolean;
    difficulty: string;
    creatorId: number;
    createdAt: Date;
    unitTests: UnitTest[];
}

export type UnitTest = {
    id: number;
    code: string;
    visible: boolean;
    problemId: number;
}