import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Version,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create.space.dto';
import { GUEST_USER_ID } from 'src/common/constants/space.constants';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpaceServiceV2 } from './space.serviceV2';
import { LoggerService } from 'src/common/logger/logger.service';
import { Logger } from '@nestjs/common';
@ApiTags('space')
@Controller('space')
export class SpaceController {
  private readonly logger = new Logger(SpaceController.name);
  constructor(
    private readonly SpaceService: SpaceService,
    private readonly SpaceServiceV2: SpaceServiceV2,
  ) {}

  @Version('2')
  @Post()
  @ApiOperation({ summary: '스페이스 생성' })
  @ApiResponse({ status: 201, description: '스페이스 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async createSubSpace(@Body() createSpaceDto: CreateSpaceDto) {
    try {
      this.logger.log('Creating new space', {
        method: 'createSubSpace',
        userId: createSpaceDto.userId,
        spaceName: createSpaceDto.spaceName,
        parentContextNodeId: createSpaceDto.parentContextNodeId,
      });

      const { userId, spaceName, parentContextNodeId } = createSpaceDto;

      if (userId !== GUEST_USER_ID || !spaceName) {
        this.logger.error(ERROR_MESSAGES.SPACE.BAD_REQUEST, {
          method: 'createSubSpace',
          error: ERROR_MESSAGES.SPACE.BAD_REQUEST,
          userId,
          spaceName,
        });
        throw new HttpException(
          ERROR_MESSAGES.SPACE.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      const urlPath = await this.SpaceService.create(
        userId,
        spaceName,
        parentContextNodeId,
      );

      if (!urlPath) {
        this.logger.error(ERROR_MESSAGES.SPACE.CREATION_FAILED, {
          method: 'createSubSpace',
          error: ERROR_MESSAGES.SPACE.CREATION_FAILED,
          userId,
          spaceName,
        });
        throw new HttpException(
          ERROR_MESSAGES.SPACE.CREATION_FAILED,
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log('Space created successfully', {
        method: 'createSubSpace',
        userId,
        spaceName,
        urlPath,
      });

      return { urlPath };
    } catch (error) {
      this.logger.error('Unexpected error in space creation', {
        method: 'createSubSpace',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @Version('1')
  @Get('/:urlPath')
  async getSpace(@Param('urlPath') urlPath: string) {
    try {
      this.logger.log('Fetching space', {
        method: 'getSpace',
        urlPath,
      });

      const result = await this.SpaceService.existsByUrlPath(urlPath);

      this.logger.log('Space fetch completed', {
        method: 'getSpace',
        urlPath,
        found: !!result,
      });

      return result ? true : false;
    } catch (error) {
      this.logger.error(ERROR_MESSAGES.SPACE.UPDATE_FAILED, {
        method: 'getSpace',
        urlPath,
        error: ERROR_MESSAGES.SPACE.UPDATE_FAILED,
        stack: error.stack,
      });
      throw error;
    }
  }

  @Version('2')
  @Get('/:urlPath')
  async getSpaceV2(@Param('urlPath') urlPath: string) {
    try {
      this.logger.log('Fetching space V2', {
        method: 'getSpaceV2',
        urlPath,
      });

      const result = await this.SpaceServiceV2.existsByUrlPath(urlPath);

      this.logger.log('Space V2 fetch completed', {
        method: 'getSpaceV2',
        urlPath,
        found: !!result,
      });

      return result ? true : false;
    } catch (error) {
      this.logger.error(ERROR_MESSAGES.SPACE.UPDATE_FAILED, {
        method: 'getSpaceV2',
        urlPath,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @Version('3')
  @Post()
  @ApiOperation({ summary: '스페이스 생성' })
  @ApiResponse({ status: 201, description: '스페이스 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async createSpaceV3(@Body() createSpaceDto: CreateSpaceDto) {
    try {
      this.logger.log('Creating new space V3', {
        method: 'createSpaceV3',
        userId: createSpaceDto.userId,
        spaceName: createSpaceDto.spaceName,
        parentContextNodeId: createSpaceDto.parentContextNodeId,
      });

      const { userId, spaceName, parentContextNodeId } = createSpaceDto;

      if (userId !== GUEST_USER_ID || !spaceName) {
        this.logger.error(ERROR_MESSAGES.SPACE.BAD_REQUEST, {
          method: 'createSubSpaceV3',
          error: ERROR_MESSAGES.SPACE.BAD_REQUEST,
          userId,
          spaceName,
        });
        throw new HttpException(
          ERROR_MESSAGES.SPACE.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      const urlPath = await this.SpaceServiceV2.create(
        userId,
        spaceName,
        parentContextNodeId,
      );

      if (!urlPath) {
        this.logger.error(ERROR_MESSAGES.SPACE.CREATION_FAILED, {
          method: 'createSpaceV3',
          error: ERROR_MESSAGES.SPACE.CREATION_FAILED,
          userId,
          spaceName,
        });
        throw new HttpException(
          ERROR_MESSAGES.SPACE.CREATION_FAILED,
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log('Space V3 created successfully', {
        method: 'createSubSpaceV3',
        userId,
        spaceName,
        urlPath,
      });

      return { urlPath };
    } catch (error) {
      this.logger.error('Unexpected error in space creation V3', {
        method: 'createSubSpaceV3',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
