import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpaceModule } from './space/space.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YjsModule } from './yjs/yjs.module';
import { NoteModule } from './note/note.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CollaborativeModule } from './collaborative/collaborative.module';
import { getMongooseConfig } from './common/config/mongo.config';
import { getTypeOrmConfig } from './common/config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getMongooseConfig,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    SpaceModule,
    YjsModule,
    NoteModule,
    CollaborativeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);
  constructor() {}

  async onModuleInit() {
    this.logger.debug('Application initilized For Debug');
    this.logger.log('Application initialized', {
      module: 'AppModule',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  }
}
