import { UnitTest } from "./unit-test";

export type Problem = {
    id: number,
    name: string,
    description: string,
    difficulty: string,
    creatorId: number,
    creatorName: string,
    createdAt: Date,
    constraints?: string,
    starterCode: string,
    unitTests: UnitTest[],
    approved?: boolean,
}