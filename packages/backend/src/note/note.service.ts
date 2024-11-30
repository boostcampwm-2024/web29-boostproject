import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { NoteDocument } from 'src/note/note.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NoteService {
  private readonly logger = new Logger(NoteService.name);

  constructor(
    @InjectModel(NoteDocument.name)
    private readonly noteModel: Model<NoteDocument>,
  ) {}

  async create(userId: string, noteName: string) {
    this.logger.log(`사용자 ${userId}에 대한 새로운 노트를 생성 중입니다.`);
    const noteDto = {
      id: uuid(),
      userId,
      name: noteName,
    };
    const note = await this.noteModel.create(noteDto);
    this.logger.debug(`노트 생성 완료 - ID: ${note.id}, 이름: ${note.name}`);
    return note;
  }

  async findById(id: string) {
    const note = await this.noteModel.findOne({ id }).exec();
    this.logger.log(`note 저장 여부 확인`);
    return note;
  }

  async existsById(id: string) {
    this.logger.log(`ID가 ${id}인 노트의 존재 여부를 확인 중입니다.`);
    const note = await this.noteModel.findOne({ id }).exec();
    const exists = !!note;
    this.logger.debug(`ID가 ${id}인 노트 존재 여부: ${exists}`);
    return exists;
  }

  async updateContent(id: string, newContent: string) {
    this.logger.log(`ID가 ${id}인 노트의 내용을 업데이트 중입니다.`);
    const note = await this.findById(id);
    if (!note) {
      this.logger.error(`업데이트 실패: ID가 ${id}인 노트를 찾을 수 없습니다.`);
      throw new BadRequestException(ERROR_MESSAGES.NOTE.NOT_FOUND);
    }

    this.logger.debug(`이전 내용: ${note.content}`);
    note.content = newContent;

    try {
      const updatedNote = await note.save();
      this.logger.log(`ID가 ${id}인 노트 내용 업데이트 완료.`);
      this.logger.debug(`업데이트된 내용: ${updatedNote.content}`);
      return updatedNote;
    } catch (error) {
      this.logger.error(
        `ID가 ${id}인 노트의 내용 업데이트 중 오류 발생.`,
        error.stack,
      );
      throw new BadRequestException(ERROR_MESSAGES.NOTE.UPDATE_FAILED);
    }
  }
}
