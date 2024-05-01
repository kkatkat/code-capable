
export type JudgeCompleteSubmissionResponse = {
    stdout: string | null;
    time: number | string;
    memory: number;
    stderr: string | null;
    token: string;
    compile_output: string | null
    message: string;
    exit_code?: number;
    exit_signal?: number;
    status: { id: number, description: string };
    created_at?: Date;
    finished_at?: Date;
    wall_time?: number;
}

export type JudgeSubmissionResponse = {
    token: string;
}