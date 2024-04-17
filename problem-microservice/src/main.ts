import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { seed } from 'database/seeding/seed';
import { runMigrations } from 'database/lib';
import { createDatabaseIfNotExist } from 'database/create-database/create-database';

async function bootstrap() {
    if (process.env.NODE_ENV === 'production') {
        await createDatabaseIfNotExist();
        await runMigrations();
        await seed();
    }

    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('p');
    const config = app.get(ConfigService);

    const problemMicroservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [`amqp://${config.get('rmqHost')}:${config.get('rmqPort')}`],
            queue: 'problem_queue',
            noAck: false,
            queueOptions: {
                durable: false
            }
        }
    })

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }));

    app.startAllMicroservices();

    console.log("App running on port " + config.get('port'));
    await app.listen(config.get('port'));
}
bootstrap();
