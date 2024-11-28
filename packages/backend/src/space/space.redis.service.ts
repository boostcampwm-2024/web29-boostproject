import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/note/common/logger/logger.service';

@Injectable()
export class SpaceRedisService {
  private readonly redis: Redis;
  private readonly SPACE_TTL = 3600;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const host = this.configService.get('REDIS_HOST');
    const port = this.configService.get('REDIS_PORT');
    const password = this.configService.get('REDIS_PASSWORD');

    this.logger.info('Initializing Redis connection', {
      service: 'SpaceRedisService',
      host,
      port,
      keyPrefix: 'space:',
    });

    this.redis = new Redis({
      host,
      port,
      password,
      keyPrefix: 'space:',
    });

    this.redis.on('error', (error) => {
      this.logger.error('Redis connection error', {
        service: 'SpaceRedisService',
        error: error.message,
        stack: error.stack,
      });
    });

    this.redis.on('connect', () => {
      this.logger.info('Redis connected successfully', {
        service: 'SpaceRedisService',
      });
    });
  }

  async setSpace(id: string, data: string) {
    try {
      this.logger.info('Setting space data in Redis', {
        method: 'setSpace',
        spaceId: id,
        dataSize: data.length,
        ttl: this.SPACE_TTL,
      });

      const result = await this.redis.set(id, data, 'EX', this.SPACE_TTL);

      this.logger.info('Space data set successfully in Redis', {
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
      this.logger.info('Getting space data from Redis', {
        method: 'getSpace',
        spaceId: id,
      });

      const data = await this.redis.get(id);

      if (!data) {
        this.logger.info('Space data not found in Redis', {
          method: 'getSpace',
          spaceId: id,
        });
        return null;
      }

      this.logger.info('Space data retrieved successfully from Redis', {
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
