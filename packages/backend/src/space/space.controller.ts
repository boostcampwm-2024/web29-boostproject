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
import { GUEST_USER_ID } from 'src/note/common/constants/space.constants';
import { ERROR_MESSAGES } from 'src/note/common/constants/error.message.constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpaceServiceV2 } from './space.serviceV2';

@ApiTags('space')
@Controller('space')
export class SpaceController {
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
    const { userId, spaceName, parentContextNodeId } = createSpaceDto;
    if (userId !== GUEST_USER_ID || !spaceName) {
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
      throw new HttpException(
        ERROR_MESSAGES.SPACE.CREATION_FAILED,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      urlPath,
    };
  }

  @Version('1')
  @Get('/:urlPath')
  @ApiOperation({ summary: '스페이스 조회' })
  @ApiResponse({ status: 201, description: '스페이스 조회 성공' })
  @ApiResponse({ status: 404, description: '스페이스 조회 실패' })
  async getSpace(@Param('urlPath') urlPath: string) {
    return await this.SpaceService.existsByUrlPath(urlPath);
  }

  @Version('2')
  @Get('test/:urlPath')
  @ApiOperation({ summary: '스페이스 조회' })
  @ApiResponse({ status: 201, description: '스페이스 조회 성공' })
  @ApiResponse({ status: 404, description: '스페이스 조회 실패' })
  async getSpaceV2(@Param('urlPath') urlPath: string) {
    return await this.SpaceServiceV2.existsByUrlPath(urlPath);
  }

  @Version('3')
  @Post('test')
  @ApiOperation({ summary: '스페이스 생성' })
  @ApiResponse({ status: 201, description: '스페이스 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async createSubSpaceV3(@Body() createSpaceDto: CreateSpaceDto) {
    const { userId, spaceName, parentContextNodeId } = createSpaceDto;
    if (userId !== GUEST_USER_ID || !spaceName) {
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
      throw new HttpException(
        ERROR_MESSAGES.SPACE.CREATION_FAILED,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      urlPath,
    };
  }
}
