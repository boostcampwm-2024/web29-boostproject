import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { SpaceDocument } from '../collaborative/collaborative.type';

@Injectable()
export class SpaceRedisService {
  private readonly redis: Redis;
  private readonly SPACE_TTL = 3600; // 1 hour

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      password: this.configService.get('REDIS_PASSWORD'),
      keyPrefix: 'space:',
    });
  }

  async setSpace(id: string, data: string): Promise<void> {
    await this.redis.set(id, data, 'EX', this.SPACE_TTL);
  }

  async getSpace(id: string): Promise<SpaceDocument | null> {
    const data = await this.redis.get(id);
    return data ? JSON.parse(data) : null;
  }
}
