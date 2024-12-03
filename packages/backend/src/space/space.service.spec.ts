import { Test, TestingModule } from '@nestjs/testing';
import { SpaceService } from './space.service';
import { getModelToken } from '@nestjs/mongoose';
import { SpaceDocument } from './space.schema';
import { SpaceValidationService } from './space.validation.service';
import { Model } from 'mongoose';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('SpaceService', () => {
  let spaceService: SpaceService;
  let spaceModel: Model<SpaceDocument>;
  let spaceValidationService: SpaceValidationService;

  beforeEach(async () => {
    const mockSpaceModel = {
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      findOneAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      countDocuments: jest.fn(),
      create: jest.fn(),
    };

    const mockSpaceValidationService = {
      validateSpaceLimit: jest.fn().mockResolvedValue(undefined),
      validateParentNodeExists: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpaceService,
        {
          provide: getModelToken(SpaceDocument.name),
          useValue: mockSpaceModel,
        },
        {
          provide: SpaceValidationService,
          useValue: mockSpaceValidationService,
        },
      ],
    }).compile();

    spaceService = module.get<SpaceService>(SpaceService);
    spaceModel = module.get<Model<SpaceDocument>>(
      getModelToken(SpaceDocument.name),
    );
    spaceValidationService = module.get<SpaceValidationService>(
      SpaceValidationService,
    );
  });

  describe('getBreadcrumb', () => {
    it('스페이스의 경로를 반환해야 한다', async () => {
      const mockSpaces = [
        { id: 'parent-id', name: 'Parent Space', parentSpaceId: null },
        { id: '123', name: 'Child Space', parentSpaceId: 'parent-id' },
      ];

      (spaceModel.findOne as jest.Mock)
        .mockReturnValueOnce({
          exec: jest.fn().mockResolvedValue(mockSpaces[1]),
        })
        .mockReturnValueOnce({
          exec: jest.fn().mockResolvedValue(mockSpaces[0]),
        });

      const result = await spaceService.getBreadcrumb('123');

      expect(spaceModel.findOne).toHaveBeenCalledWith({ id: '123' });
      expect(spaceModel.findOne).toHaveBeenCalledWith({ id: 'parent-id' });
      expect(result).toEqual([
        { name: 'Parent Space', url: 'parent-id' },
        { name: 'Child Space', url: '123' },
      ]);
    });
  });
});
