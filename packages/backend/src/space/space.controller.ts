import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Version,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ERROR_MESSAGES } from '../common/constants/error.message.constants';
import { GUEST_USER_ID } from '../common/constants/space.constants';
import { CreateSpaceDto } from './dto/create.space.dto';
import { SpaceService } from './space.service';
import { UpdateSpaceDto } from './dto/update.space.dto';

@ApiTags('space')
@Controller('space')
export class SpaceController {
  private readonly logger = new Logger(SpaceController.name);

  constructor(private readonly spaceService: SpaceService) {}

  @Version('1')
  @Get('/:id')
  async existsBySpace(@Param('id') id: string) {
    try {
      this.logger.log('스페이스 ID 조회', {
        method: 'existsBySpace',
        id,
      });

      const result = await this.spaceService.existsById(id);

      this.logger.log('스페이스 ID 조회 완료', {
        method: 'existsBySpace',
        id,
        found: !!result,
      });

      return result;
    } catch (error) {
      this.logger.error('스페이스 ID 조회 실패', {
        method: 'existsBySpace',
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @Version('1')
  @Get('/breadcrumb/:id')
  async getBreadcrumb(@Param('id') id: string) {
    this.logger.log('스페이스 경로 조회', {
      method: 'getBreadcrumb',
      id,
    });

    const result = await this.spaceService.getBreadcrumb(id);

    this.logger.log('스페이스 경로 조회 완료', {
      method: 'getBreadcrumb',
      id,
    });

    return result;
  }

  @Version('2')
  @Post()
  @ApiOperation({ summary: '스페이스 생성' })
  @ApiResponse({ status: 201, description: '스페이스 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async createSpace(@Body() createSpaceDto: CreateSpaceDto) {
    try {
      const { userId, spaceName, parentContextNodeId } = createSpaceDto;

      this.logger.log('스페이스 생성 요청', {
        method: 'createSpace',
        userId,
        spaceName,
        parentContextNodeId,
      });

      if (userId !== GUEST_USER_ID || !spaceName) {
        this.logger.error('스페이스 생성 실패 - 잘못된 요청', {
          method: 'createSpace',
          error: ERROR_MESSAGES.SPACE.BAD_REQUEST,
          userId,
          spaceName,
        });
        throw new HttpException(
          ERROR_MESSAGES.SPACE.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      const space = await this.spaceService.create(
        userId,
        spaceName,
        parentContextNodeId,
      );

      if (!space) {
        this.logger.error('스페이스 생성 실패', {
          method: 'createSpace',
          error: ERROR_MESSAGES.SPACE.CREATION_FAILED,
          userId,
          spaceName,
        });
        throw new HttpException(
          ERROR_MESSAGES.SPACE.CREATION_FAILED,
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log('스페이스 생성 완료', {
        method: 'createSpace',
        userId,
        spaceName,
        result: space.toObject().id,
      });

      return { urlPath: space.toObject().id };
    } catch (error) {
      this.logger.error('스페이스 생성 중 예기치 못한 오류 발생', {
        method: 'createSpace',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @Version('1')
  @Put('/:id')
  @ApiOperation({ summary: '스페이스 업데이트' })
  @ApiResponse({ status: 201, description: '스페이스 업데이트 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async updateSpaceByName(
    @Param('id') id: string,
    @Body() updateSpaceDto: UpdateSpaceDto,
  ) {
    const result = await this.spaceService.updateById(id, updateSpaceDto);

    if (!result) {
      this.logger.error('스페이스 업데이트 실패 - 스페이스를 찾을 수 없음', {
        method: 'updateSpace',
        error: ERROR_MESSAGES.SPACE.NOT_FOUND,
        id,
      });
      throw new HttpException(
        ERROR_MESSAGES.SPACE.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Version('1')
  @Delete('/:id')
  @ApiOperation({ summary: '스페이스 삭제' })
  @ApiResponse({ status: 201, description: '스페이스 삭제 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async deleteSpace(@Param('id') id: string) {
    const result = await this.spaceService.deleteById(id);

    if (!result) {
      this.logger.error(
        '스페이스 삭제 실패 - 스페이스 삭제에 실패하였습니다.',
        {
          method: 'deleteSpace',
          error: ERROR_MESSAGES.SPACE.DELETE_FAILED,
          id,
        },
      );
      throw new HttpException(
        ERROR_MESSAGES.SPACE.DELETE_FAILED,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
