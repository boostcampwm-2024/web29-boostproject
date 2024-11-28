import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpaceModule } from './space/space.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YjsModule } from './yjs/yjs.module';
import { NoteModule } from './note/note.module';
import { RedisModule } from './redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './common/logger/logger.module';
import { CollaborativeModule } from './collaborative/collaborative.module';
import { LoggerService } from './common/logger/logger.service';
import { getMongooseConfig } from './common/config/mongo.config';
import { getTypeOrmConfig } from './common/config/typeorm.config';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [LoggerModule],
      inject: [ConfigService, LoggerService],
      useFactory: getMongooseConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [LoggerModule],
      inject: [ConfigService, LoggerService],
      useFactory: getTypeOrmConfig,
    }),
    SpaceModule,
    YjsModule,
    NoteModule,
    RedisModule,
    CollaborativeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly logger: LoggerService) {}

  async onModuleInit() {
    this.logger.info('Application initialized', {
      module: 'AppModule',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  }
}
