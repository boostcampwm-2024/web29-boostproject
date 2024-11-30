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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NoteService } from './note.service';
import { GUEST_USER_ID } from 'src/common/constants/space.constants';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { CreateNoteDto } from './dto/note.dto';
@ApiTags('note')
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Version('1')
  @Post()
  @ApiOperation({ summary: '노트 생성' })
  @ApiResponse({ status: 201, description: '노트 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async createNote(@Body() createNoteDto: CreateNoteDto) {
    const { userId, noteName } = createNoteDto;

    if (userId !== GUEST_USER_ID || !noteName) {
      throw new HttpException(
        ERROR_MESSAGES.NOTE.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
    const note = await this.noteService.create(userId, noteName);
    return {
      urlPath: note.toObject().id,
    };
  }

  @Version('1')
  @Get('/:urlPath')
  @ApiOperation({ summary: '노트 조회' })
  @ApiResponse({ status: 201, description: '노트 조회 성공' })
  @ApiResponse({ status: 404, description: '노트 조회 실패' })
  async getSpace(@Param('urlPath') urlPath: string) {
    const note = await this.noteService.findById(urlPath);
    if (!note) {
      throw new HttpException(
        ERROR_MESSAGES.NOTE.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      note,
    };
  }
}
