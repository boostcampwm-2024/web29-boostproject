import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redisStore from 'cache-manager-redis-store';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createCacheOptions(): CacheModuleOptions {
    const config: CacheModuleOptions = {
      store: redisStore,
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      ttl: this.configService.get<number>('REDIS_TTL'),
    };
    console.log(JSON.stringify(config));
    return config;
  }
}
