export class RunResponse {
    output?: string[];
    error?: boolean;
    submitted?: boolean;
    time?: string | number;
    memory?: number;
    retries?: number;
}