import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class LoggerService {
  private readonly index = 'app-logs';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async log(message: string, context: any = {}) {
    try {
      await this.elasticsearchService.index({
        index: this.index,
        document: {
          message,
          context,
          timestamp: new Date(),
          level: 'info',
        },
      });
    } catch (error) {
      console.error('Elasticsearch logging failed:', error);
    }
  }

  async search(query: string) {
    const result = await this.elasticsearchService.search({
      index: this.index,
      query: {
        match: {
          message: query,
        },
      },
    });
    return result.hits.hits;
  }
}
