import { Test, TestingModule } from '@nestjs/testing';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create.space.dto';
import { HttpException } from '@nestjs/common';
import { GUEST_USER_ID } from '../common/constants/space.constants';

describe('SpaceController', () => {
  let spaceController: SpaceController;
  let spaceService: Partial<SpaceService>;

  beforeEach(async () => {
    spaceService = {
      existsById: jest.fn(),
      getBreadcrumb: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaceController],
      providers: [
        {
          provide: SpaceService,
          useValue: spaceService,
        },
      ],
    }).compile();

    spaceController = module.get<SpaceController>(SpaceController);
  });

  describe('existsBySpace', () => {
    it('스페이스가 존재할 경우 true를 반환해야 한다', async () => {
      const spaceId = '123';
      (spaceService.existsById as jest.Mock).mockResolvedValue(true);

      const result = await spaceController.existsBySpace(spaceId);

      expect(spaceService.existsById).toHaveBeenCalledWith(spaceId);
      expect(result).toBe(true);
    });

    it('예외가 발생하면 오류를 던져야 한다', async () => {
      const spaceId = '123';
      (spaceService.existsById as jest.Mock).mockRejectedValue(
        new Error('Unexpected Error'),
      );

      await expect(spaceController.existsBySpace(spaceId)).rejects.toThrow(
        'Unexpected Error',
      );
    });
  });

  describe('getBreadcrumb', () => {
    it('주어진 스페이스 ID에 대한 경로를 반환해야 한다', async () => {
      const spaceId = '123';
      const breadcrumb = ['Home', 'Space'];
      (spaceService.getBreadcrumb as jest.Mock).mockResolvedValue(breadcrumb);

      const result = await spaceController.getBreadcrumb(spaceId);

      expect(spaceService.getBreadcrumb).toHaveBeenCalledWith(spaceId);
      expect(result).toEqual(breadcrumb);
    });
  });

  describe('createSpace', () => {
    it('스페이스를 생성하고 URL 경로를 반환해야 한다', async () => {
      const createSpaceDto: CreateSpaceDto = {
        userId: GUEST_USER_ID,
        spaceName: 'New Space',
        parentContextNodeId: '123',
      };

      const mockSpace = { toObject: () => ({ id: 'space123' }) };
      (spaceService.create as jest.Mock).mockResolvedValue(mockSpace);

      const result = await spaceController.createSpace(createSpaceDto);

      expect(spaceService.create).toHaveBeenCalledWith(
        GUEST_USER_ID,
        'New Space',
        '123',
      );
      expect(result).toEqual({ urlPath: 'space123' });
    });

    it('잘못된 요청인 경우 400 오류를 던져야 한다', async () => {
      const createSpaceDto: CreateSpaceDto = {
        userId: 'invalidUser',
        spaceName: '',
        parentContextNodeId: '123',
      };

      await expect(spaceController.createSpace(createSpaceDto)).rejects.toThrow(
        HttpException,
      );

      expect(spaceService.create).not.toHaveBeenCalled();
    });

    it('스페이스 생성에 실패한 경우 404 오류를 던져야 한다', async () => {
      const createSpaceDto: CreateSpaceDto = {
        userId: GUEST_USER_ID,
        spaceName: 'New Space',
        parentContextNodeId: '123',
      };

      (spaceService.create as jest.Mock).mockResolvedValue(null);

      await expect(spaceController.createSpace(createSpaceDto)).rejects.toThrow(
        HttpException,
      );

      expect(spaceService.create).toHaveBeenCalledWith(
        GUEST_USER_ID,
        'New Space',
        '123',
      );
    });
  });
});
