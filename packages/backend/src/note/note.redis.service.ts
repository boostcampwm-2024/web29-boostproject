import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { NoteDocument } from '../collaborative/collaborative.type';

@Injectable()
export class NoteRedisService {
  private readonly redis: Redis;
  private readonly NOTE_TTL = 3600;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      password: this.configService.get('REDIS_PASSWORD'),
      keyPrefix: 'note:',
    });
  }

  async setNote(id: string, data: string): Promise<void> {
    await this.redis.set(id, JSON.stringify(data), 'EX', this.NOTE_TTL);
  }

  async getNote(id: string): Promise<NoteDocument | null> {
    const data = await this.redis.get(id);
    return data ? JSON.parse(data) : null;
  }
}
