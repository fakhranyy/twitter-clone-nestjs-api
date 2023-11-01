import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSrv: ConfigService) => ({
        type: 'mysql',
        host: configSrv.get('DB_HOST'),
        port: configSrv.get('DB_PORT'),
        username: configSrv.get('DB_USERNAME'),
        password: configSrv.get('DB_PASSWORD'),
        database: configSrv.get('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true, // don't use this in production
      }),
    }),
  ],
})
export class DatabaseModule {}
