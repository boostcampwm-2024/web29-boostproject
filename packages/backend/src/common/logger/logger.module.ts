import { Module } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LoggerService } from './logger.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>('ELASTIC_NODE') as string,
        auth: {
          username: configService.get<string>('ELASTIC_USERNAME') as string,
          password: configService.get<string>('ELASTIC_PASSWORD') as string,
        },
      }),
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.colorize(),
            nestWinstonModuleUtilities.format.nestLike('YourApp', {
              prettyPrint: true,
            }),
          ),
        }),

        new winston.transports.DailyRotateFile({
          level: 'error',
          dirname: 'logs/error',
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),

        new winston.transports.DailyRotateFile({
          dirname: 'logs/combined',
          filename: 'combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  ],
  providers: [LoggerService],
  exports: [WinstonModule, LoggerService],
})
export class LoggerModule {}
