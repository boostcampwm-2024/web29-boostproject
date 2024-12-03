import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ERROR_MESSAGES } from '../common/constants/error.message.constants';
import { GUEST_USER_ID } from '../common/constants/space.constants';
import { CreateNoteDto } from './dto/note.dto';
import { NoteService } from './note.service';

@ApiTags('note')
@Controller('note')
export class NoteController {
  private readonly logger = new Logger(NoteController.name);

  constructor(private readonly noteService: NoteService) {}

  @Version('1')
  @Post()
  @ApiOperation({ summary: '노트 생성' })
  @ApiResponse({ status: 201, description: '노트 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async createNote(@Body() createNoteDto: CreateNoteDto) {
    const { userId, noteName } = createNoteDto;

    this.logger.log('노트 생성 요청 수신', {
      method: 'createNote',
      userId,
      noteName,
    });

    if (userId !== GUEST_USER_ID || !noteName) {
      this.logger.error('노트 생성 요청 실패 - 잘못된 요청', {
        method: 'createNote',
        userId,
        noteName,
        error: ERROR_MESSAGES.NOTE.BAD_REQUEST,
      });

      throw new HttpException(
        ERROR_MESSAGES.NOTE.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const note = await this.noteService.create(userId, noteName);

      this.logger.log('노트 생성 성공', {
        method: 'createNote',
        userId,
        noteName,
        noteId: note.toObject().id,
      });

      return {
        urlPath: note.toObject().id,
      };
    } catch (error) {
      this.logger.error('노트 생성 중 예상치 못한 오류 발생', {
        method: 'createNote',
        error: error.message,
        stack: error.stack,
      });

      throw new HttpException(
        ERROR_MESSAGES.NOTE.CREATION_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Version('1')
  @Get('/:id')
  @ApiOperation({ summary: '노트 조회' })
  @ApiResponse({ status: 200, description: '노트 조회 성공' })
  @ApiResponse({ status: 404, description: '노트 조회 실패' })
  async existsByNote(@Param('id') id: string) {
    this.logger.log('노트 조회 요청 수신', {
      method: 'existsByNote',
      id,
    });

    try {
      const result = await this.noteService.existsById(id);

      this.logger.log('노트 조회 완료', {
        method: 'existsByNote',
        id,
        found: result,
      });

      return result;
    } catch (error) {
      this.logger.error('노트 조회 중 예상치 못한 오류 발생', {
        method: 'existsByNote',
        id,
        error: error.message,
        stack: error.stack,
      });

      throw new HttpException(
        ERROR_MESSAGES.NOTE.NOT_FOUND,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Version('1')
  @Delete('/:id')
  @ApiOperation({ summary: '노트 조회' })
  @ApiResponse({ status: 200, description: '노트 조회 성공' })
  @ApiResponse({ status: 404, description: '노트 조회 실패' })
  async deleteNote(@Param('id') id: string) {
    const result = await this.noteService.deleteById(id);
    this.logger.log('노트 삭제 완료', {
      method: 'deleteNote',
      id,
      result: !!result,
    });
    return !!result;
  }
}
