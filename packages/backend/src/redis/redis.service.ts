import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import {
  SpaceDocument,
  NoteDocument,
} from '../collaborative/collaborative.type';
export type DocumentType = 'space' | 'note';
export type Document = SpaceDocument | NoteDocument;

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;
  private readonly DOCUMENT_TTL = 3600;
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

  private getKey(type: DocumentType, id: string): string {
    return `${type}:${id}`;
  }

  async setDocument<T extends Document>(
    type: DocumentType,
    id: string,
    data: T,
  ): Promise<void> {
    const key = this.getKey(type, id);
    await this.redis.set(key, JSON.stringify(data), 'EX', this.DOCUMENT_TTL);
  }

  async getDocument<T extends Document>(
    type: DocumentType,
    id: string,
  ): Promise<T | null> {
    const key = this.getKey(type, id);
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async getAllKeys(type: DocumentType): Promise<string[]> {
    return await this.redis.keys(`${type}:*`);
  }

  async setSpace(id: string, data: SpaceDocument): Promise<void> {
    return this.setDocument('space', id, data);
  }

  async getSpace(id: string): Promise<SpaceDocument | null> {
    return this.getDocument<SpaceDocument>('space', id);
  }

  async getAllSpaceKeys(): Promise<string[]> {
    return this.getAllKeys('space');
  }

  async setNote(id: string, data: NoteDocument): Promise<void> {
    return this.setDocument('note', id, data);
  }

  async getNote(id: string): Promise<NoteDocument | null> {
    return this.getDocument<NoteDocument>('note', id);
  }

  async getAllNoteKeys(): Promise<string[]> {
    return this.getAllKeys('note');
  }
}
