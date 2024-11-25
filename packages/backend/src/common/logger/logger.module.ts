import { Module } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
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

        // 에러 로그 파일
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

        // 전체 로그 파일
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
  exports: [WinstonModule],
})
export class LoggerModule {}
