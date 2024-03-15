import axios from "../config/axiosConfig";
import { Problem } from "../entities/problem";

export type CreateProblemRequest = {
    creatorId: number;
    name: string;
    description: string;
    constraints?: string;
    starterCode: string;
    difficulty: string;
    unitTests: UnitTestCreateDTO[];
}

export type UnitTestCreateDTO = {
    code: string;
    visible?: boolean;
}

export function createProblem(request: CreateProblemRequest) {
    return axios.post('/p/problem', request).then((res) => res.data);
}

export function getProblembyId(id: number) {
    return axios.get(`/p/problem/${id}`).then((res) => res.data as Problem)
}