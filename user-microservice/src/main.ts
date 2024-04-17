import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDatabaseIfNotExist } from 'database/create-database/create-database';
import { runMigrations } from 'database/lib';
import { seed } from 'database/seeding/seed';

async function bootstrap() {
    if (process.env.NODE_ENV === 'production') {
        await createDatabaseIfNotExist();
        await runMigrations();
        await seed();
    }

    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('u');
    const config = app.get(ConfigService);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }));

    console.log("App running on port " + config.get('port'));
    await app.listen(config.get('port'));
}
bootstrap();
