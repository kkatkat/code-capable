import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('r');
    const config = app.get(ConfigService);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }));

    if (!!process.env.SENTRY_DSN && process.env.NODE_ENV !== 'development') {
        console.log('Sentry enabled');
    }

    console.log("Using Judge0: " + config.get('useJudge'))
    console.log("App running on port " + config.get('port'));
    await app.listen(config.get('port'));
}
bootstrap();
