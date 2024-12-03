import { Test, TestingModule } from '@nestjs/testing';
import { SpaceValidation } from './space.validation.service';
import { getModelToken } from '@nestjs/mongoose';
import { SpaceDocument } from './space.schema';
import { Model } from 'mongoose';
import { ERROR_MESSAGES } from '../common/constants/error.message.constants';
import { MAX_SPACES } from '../common/constants/space.constants';

describe('SpaceValidation', () => {
  let spaceValidation: SpaceValidation;
  let spaceModel: Model<SpaceDocument>;

  beforeEach(async () => {
    const mockSpaceModel = {
      countDocuments: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpaceValidation,
        {
          provide: getModelToken(SpaceDocument.name),
          useValue: mockSpaceModel,
        },
      ],
    }).compile();

    spaceValidation = module.get<SpaceValidation>(SpaceValidation);
    spaceModel = module.get<Model<SpaceDocument>>(
      getModelToken(SpaceDocument.name),
    );
  });

  describe('validateSpaceLimit', () => {
    it('스페이스가 최대 제한을 초과하면 예외를 던져야 한다', async () => {
      (spaceModel.countDocuments as jest.Mock).mockResolvedValue(MAX_SPACES);

      await expect(
        spaceValidation.validateSpaceLimit('user123'),
      ).rejects.toThrow(ERROR_MESSAGES.SPACE.LIMIT_EXCEEDED);

      expect(spaceModel.countDocuments).toHaveBeenCalledWith({
        userId: 'user123',
      });
    });

    it('스페이스가 최대 제한을 초과하지 않으면 예외를 던지지 않아야 한다', async () => {
      (spaceModel.countDocuments as jest.Mock).mockResolvedValue(
        MAX_SPACES - 1,
      );

      await expect(
        spaceValidation.validateSpaceLimit('user123'),
      ).resolves.not.toThrow();

      expect(spaceModel.countDocuments).toHaveBeenCalledWith({
        userId: 'user123',
      });
    });
  });

  describe('validateParentNodeExists', () => {
    it('parentContextNodeId가 없으면 예외를 던지지 않아야 한다', async () => {
      await expect(
        spaceValidation.validateParentNodeExists(null),
      ).resolves.not.toThrow();

      expect(spaceModel.findOne).not.toHaveBeenCalled();
    });

    it('parentContextNodeId가 존재하지만 스페이스를 찾지 못하면 예외를 던져야 한다', async () => {
      (spaceModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        spaceValidation.validateParentNodeExists('parent-id'),
      ).rejects.toThrow(ERROR_MESSAGES.SPACE.PARENT_NOT_FOUND);

      expect(spaceModel.findOne).toHaveBeenCalledWith({
        id: 'parent-id',
      });
    });

    it('parentContextNodeId가 존재하고 스페이스를 찾으면 예외를 던지지 않아야 한다', async () => {
      (spaceModel.findOne as jest.Mock).mockResolvedValue({
        id: 'parent-id',
      });

      await expect(
        spaceValidation.validateParentNodeExists('parent-id'),
      ).resolves.not.toThrow();

      expect(spaceModel.findOne).toHaveBeenCalledWith({
        id: 'parent-id',
      });
    });
  });

  describe('validateSpaceExists', () => {
    it('urlPath에 해당하는 스페이스가 없으면 예외를 던져야 한다', async () => {
      (spaceModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        spaceValidation.validateSpaceExists('test-path'),
      ).rejects.toThrow(ERROR_MESSAGES.SPACE.NOT_FOUND);

      expect(spaceModel.findOne).toHaveBeenCalledWith({
        urlPath: 'test-path',
      });
    });

    it('urlPath에 해당하는 스페이스가 있으면 예외를 던지지 않고 해당 스페이스를 반환해야 한다', async () => {
      const mockSpace = { id: 'space-id', name: 'Test Space' };
      (spaceModel.findOne as jest.Mock).mockResolvedValue(mockSpace);

      const result = await spaceValidation.validateSpaceExists('test-path');

      expect(spaceModel.findOne).toHaveBeenCalledWith({
        urlPath: 'test-path',
      });
      expect(result).toEqual(mockSpace);
    });
  });
});
