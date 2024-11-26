import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpaceModule } from './space/space.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YjsModule } from './yjs/yjs.module';
import { NoteModule } from './note/note.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheContextModule } from './cache-context/cache-context.module';
import { RedisModule } from './redis/redis.module';
import * as redisStore from 'cache-manager-redis-store';
import { MongooseModule } from '@nestjs/mongoose';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { LoggerModule } from './common/logger/logger.module';
import { Space, SpaceSchema } from './schema/space.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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

    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: parseInt(process.env.REDIS_TTL || '3600'),
      password: process.env.REDIS_PASSWORD,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('MONGO_HOST');
        const user = configService.get<string>('MONGO_USER');
        const pass = configService.get<string>('MONGO_PASSWORD');
        const dbName = configService.get<string>('MONGO_DB');
        const uri = `mongodb://${user}:${pass}@${host}:27017/${dbName}`;
        return {
          uri,
          authSource: 'admin',
          authMechanism: 'SCRAM-SHA-256',
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USERNAME'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [__dirname + '/**/*.entity.js'],
        timezone: '+09:00',
        synchronize: process.env.NODE_ENV !== 'production',
        autoLoadEntities: true,
      }),
    }),
    SpaceModule,
    YjsModule,
    NoteModule,
    CacheContextModule,
    RedisModule,
    LoggerModule,
    MongooseModule.forFeature([{ name: Space.name, schema: SpaceSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
