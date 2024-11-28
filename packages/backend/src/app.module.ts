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
import { LoggerModule } from './note/common/logger/logger.module';
import { CollaborativeModule } from './collaborative/collaborative.module';
import { LoggerService } from './note/common/logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService, LoggerService],
      useFactory: async (
        configService: ConfigService,
        logger: LoggerService,
      ) => {
        const host = configService.get<string>('MONGO_HOST');
        const user = configService.get<string>('MONGO_USER');
        const pass = configService.get<string>('MONGO_PASSWORD');
        const dbName = configService.get<string>('MONGO_DB');
        const uri = `mongodb://${user}:${pass}@${host}:27017/${dbName}`;

        logger.info('Initializing MongoDB connection', {
          module: 'AppModule',
          database: dbName,
          host: host,
        });

        return {
          uri,
          authSource: 'admin',
          authMechanism: 'SCRAM-SHA-256',
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              logger.info('MongoDB connected successfully', {
                module: 'AppModule',
                database: dbName,
              });
            });

            connection.on('error', (error) => {
              logger.error('MongoDB connection error', {
                module: 'AppModule',
                error: error.message,
                stack: error.stack,
              });
            });

            return connection;
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, LoggerService],
      useFactory: async (
        configService: ConfigService,
        logger: LoggerService,
      ) => {
        const host = configService.get<string>('MYSQL_HOST');
        const port = configService.get<number>('MYSQL_PORT');
        const database = configService.get<string>('MYSQL_DATABASE');

        logger.info('Initializing MySQL connection', {
          module: 'AppModule',
          host,
          port,
          database,
        });

        return {
          type: 'mysql',
          host,
          port,
          username: configService.get<string>('MYSQL_USER'),
          password: configService.get<string>('MYSQL_PASSWORD'),
          database,
          entities: [__dirname + '/**/*.entity.js'],
          timezone: '+09:00',
          synchronize: process.env.NODE_ENV !== 'production',
          autoLoadEntities: true,
          logging: true,
        };
      },
    }),
    SpaceModule,
    YjsModule,
    NoteModule,
    RedisModule,
    LoggerModule,
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
