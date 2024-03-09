import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import config from 'src/config/config';

const cfg = config();

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'PROBLEM_MICROSERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [`amqp://${cfg.rmqHost}:${cfg.rmqPort}`],
                    queue: 'problem_queue',
                    queueOptions: {
                        durable: false
                    }
                }
            },
        ])
    ],
    exports: [ClientsModule]
})
export class RmqModule { }