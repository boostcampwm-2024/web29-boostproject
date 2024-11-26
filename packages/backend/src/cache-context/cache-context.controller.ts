import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CacheContextService } from './cache-context.service';

@Controller('cache-context')
export class CacheContextController {
  constructor(private readonly cacheContextService: CacheContextService) {}

  @Post()
  async cacheContextSave(
    @Body('key') key: string,
    @Body('value') value: string,
  ): Promise<string> {
    await this.cacheContextService.save(key, value);
    return `Key: ${key} with Value: ${value} has been cached.`;
  }

  @Get()
  async cacheContextFind(@Query('key') key: string): Promise<string | null> {
    const result = await this.cacheContextService.find(key);
    return result ? `Cached Value: ${result}` : `Key: ${key} not found.`;
  }
}
