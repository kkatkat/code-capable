import axios from "../config/axiosConfig";

export type RunCodeRequest = {
    code: string;
    problemId: number;
    submit?: boolean;
}

export type RunCodeResponse = {
    output?: string[];
    error?: boolean;
    submitted?: boolean;
}

export async function runCode(request: RunCodeRequest) {
    return axios.post('/r/runner/run', request).then((res) => res.data as RunCodeResponse)
}