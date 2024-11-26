import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

const cacheModule = CacheModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    isGlobal: true,
    store: redisStore,
    url: `redis://${configService.get<string>('REDIS_USERNAME') || ''}:${configService.get<string>('REDIS_PASSWORD')}@${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`,
    ttl: configService.get<number>('REDIS_TTL') ?? 60,
  }),
});
@Module({
  imports: [cacheModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
