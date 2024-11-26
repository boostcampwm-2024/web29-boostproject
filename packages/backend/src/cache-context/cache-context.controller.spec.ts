import { Test, TestingModule } from '@nestjs/testing';
import { CacheContextController } from './cache-context.controller';

describe('CacheContextController', () => {
  let controller: CacheContextController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CacheContextController],
    }).compile();

    controller = module.get<CacheContextController>(CacheContextController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
