import { UnitTest } from "./unit-test";

export type Problem = {
    id: string,
    name: string,
    description: string,
    difficulty: string,
    creatorId: number,
    createdAt: Date,
    constraints?: string,
    starterCode: string,
    unitTests: UnitTest[],
    approved?: boolean,
}