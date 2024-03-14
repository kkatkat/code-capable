import axios from "../config/axiosConfig";

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

export function createProblem( request: CreateProblemRequest) {
    return axios.post('/p/problem', request).then((res) => res.data);
}