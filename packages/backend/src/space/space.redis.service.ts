import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class SpaceRedisService {
  private readonly redis: Redis;
  private readonly SPACE_TTL = 3600;
  private readonly logger = new Logger(SpaceRedisService.name);

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get('REDIS_HOST');
    const port = this.configService.get('REDIS_PORT');
    const password = this.configService.get('REDIS_PASSWORD');
    this.redis = new Redis({
      host,
      port,
      password,
      keyPrefix: 'space:',
    });
  }

  async setSpace(id: string, data: string) {
    try {
      this.logger.log('Setting space data in Redis', {
        method: 'setSpace',
        spaceId: id,
        dataSize: data.length,
        ttl: this.SPACE_TTL,
      });

      const result = await this.redis.set(id, data, 'EX', this.SPACE_TTL);

      this.logger.log('Space data set successfully in Redis', {
        method: 'setSpace',
        spaceId: id,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to set space data in Redis', {
        method: 'setSpace',
        spaceId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getSpace(id: string) {
    try {
      this.logger.log('Getting space data from Redis', {
        method: 'getSpace',
        spaceId: id,
      });

      const data = await this.redis.get(id);

      if (!data) {
        this.logger.log('Space data not found in Redis', {
          method: 'getSpace',
          spaceId: id,
        });
        return null;
      }

      this.logger.log('Space data retrieved successfully from Redis', {
        method: 'getSpace',
        spaceId: id,
        dataSize: data.length,
      });

      return JSON.parse(data);
    } catch (error) {
      this.logger.error('Failed to get space data from Redis', {
        method: 'getSpace',
        spaceId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
