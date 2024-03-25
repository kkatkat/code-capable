import { Paginated } from "../common/lib";
import axios from "../config/axiosConfig";
import { Problem } from "../entities/problem";
import { Solution } from "../entities/solution";

export type CreateProblemRequest = {
    creatorId: number;
    creatorName: string;
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

export type ProblemFilter = {
    difficulty?: string;
    order?: string;
    query?: string;
    page?: string;
    pageSize?: string;
    creatorId?: number;
}

export type UserStatistics = {
    easies: number,
    mediums: number,
    hards: number,
    total: number
}

export function createProblem(request: CreateProblemRequest) {
    return axios.post('/p/problem', request).then((res) => res.data);
}

export function getProblembyId(id: number) {
    return axios.get(`/p/problem/${id}`).then((res) => res.data as Problem)
}

export function approveProblem(id: number) {
    return axios.post(`/p/problem/approve/${id}`).then(() => {return true;})
}

export function deleteProblem(id: number) {
    return axios.delete(`/p/problem/${id}`).then(() => {return true;})
}

export function getUserSubmissions(userId: number, problemId: number) {
    return axios.get(`/p/solution/user/${userId}/${problemId}`).then((res) => res.data as Solution[])
}

export function getSolutionsForProblem(problemId: number, page?: number) {
    return axios.get(`/p/solution/problem/${problemId}?page=${page}`).then((res) => res.data as Paginated<Solution>)
}

export function getAllProblemsFiltered(filters: ProblemFilter) {
    return axios.get('/p/problem', {params: filters}).then((res) => res.data as Paginated<Problem>)
}

export function getUserStatistics(userId: number) {
    return axios.get(`/p/solution/statistics/user/${userId}`).then((res) => res.data as UserStatistics)
}

export function getSolutionsForUser(userId: number, page?: number) {
    return axios.get(`/p/solution/user/${userId}?page=${page}`).then((res) => res.data as Paginated<Solution>)
}