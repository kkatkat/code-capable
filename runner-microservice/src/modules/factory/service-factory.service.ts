import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { RunnerService } from "../runner/runner.service";


@Injectable()
export class ServiceFactory {
    constructor(
        @Inject(forwardRef(() => RunnerService))
        public readonly runnerService: RunnerService,

    ) {}
}