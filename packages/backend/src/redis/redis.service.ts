import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private logger = new Logger(RedisService.name);
  private redis: Redis;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    try {
      await this.redis.set(key, value, 'EX', ttl);
      this.logger.log(`Set key: ${key} with value: ${value} and TTL: ${ttl}`);
    } catch (error) {
      this.logger.error(`Error setting key: ${key}`, error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redis.get(key);
      this.logger.log(`Get key: ${key}, value: ${value}`);
      return value;
    } catch (error) {
      this.logger.error(`Error getting key: ${key}`, error);
      throw error;
    }
  }
}
