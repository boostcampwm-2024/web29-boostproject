// src/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class LoggerService {
  private readonly index = 'app-logs';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async log(level: string, message: string, metadata: any = {}) {
    try {
      await this.elasticsearchService.index({
        index: this.index,
        document: {
          '@timestamp': new Date(),
          level,
          message,
          ...metadata,
        },
      });
    } catch (error) {
      console.error('Error logging to Elasticsearch:', error);
    }
  }

  async info(message: string, metadata: any = {}) {
    return this.log('info', message, metadata);
  }

  async error(message: string, metadata: any = {}) {
    return this.log('error', message, metadata);
  }

  async warn(message: string, metadata: any = {}) {
    return this.log('warn', message, metadata);
  }

  async debug(message: string, metadata: any = {}) {
    return this.log('debug', message, metadata);
  }
}
