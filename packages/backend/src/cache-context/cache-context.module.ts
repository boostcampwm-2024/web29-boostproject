import { Global, Module } from '@nestjs/common';
import { CacheContextController } from './cache-context.controller';
import { CacheContextService } from './cache-context.service';
import { RedisModule } from 'src/redis/redis.module';

@Global()
@Module({
  imports: [RedisModule],
  controllers: [CacheContextController],
  providers: [CacheContextService],
})
export class CacheContextModule {}
