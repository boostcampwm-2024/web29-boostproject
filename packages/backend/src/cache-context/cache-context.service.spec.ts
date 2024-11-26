import { Test, TestingModule } from '@nestjs/testing';
import { CacheContextService } from './cache-context.service';

describe('CacheContextService', () => {
  let service: CacheContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheContextService],
    }).compile();

    service = module.get<CacheContextService>(CacheContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
