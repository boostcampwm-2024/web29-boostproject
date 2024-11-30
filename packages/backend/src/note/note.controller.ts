import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NoteService } from './note.service';
import { GUEST_USER_ID } from 'src/common/constants/space.constants';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { CreateNoteDto } from './dto/note.dto';

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
  async exsistByNote(@Param('id') id: string) {
    this.logger.log('노트 조회 요청 수신', {
      method: 'getSpace',
      id,
    });

    try {
      const result = await this.noteService.findById(id);
      this.logger.log('노트 조회 완료', {
        method: 'getSpace',
        id,
        found: !!result,
      });

      if (!result) {
        this.logger.error('노트 조회 실패 - 노트가 존재하지 않음', {
          method: 'getSpace',
          id,
          error: ERROR_MESSAGES.NOTE.NOT_FOUND,
        });
        throw new HttpException(
          ERROR_MESSAGES.NOTE.NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      return result ? true : false;
    } catch (error) {
      this.logger.error('노트 조회 중 예상치 못한 오류 발생', {
        method: 'getSpace',
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
}
