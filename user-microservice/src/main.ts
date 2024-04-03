import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  
  console.log("App running on port " + config.get('port'));
  await app.listen(config.get('port'));
}
bootstrap();
