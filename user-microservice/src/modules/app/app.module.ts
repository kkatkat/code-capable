import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';
import { dataSourceOptions } from 'database/data-source';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot(dataSourceOptions)
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
