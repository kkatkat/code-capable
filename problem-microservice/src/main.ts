import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
