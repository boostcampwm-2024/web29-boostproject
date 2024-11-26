import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheContextService {
  constructor(private readonly redisService: RedisService) {}

  async save(key: string, value: string): Promise<void> {
    await this.redisService.set(key, value);
  }

  async find(key: string): Promise<string | null> {
    return await this.redisService.get(key);
  }
}
