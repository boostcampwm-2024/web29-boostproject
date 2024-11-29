import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SnowflakeService } from 'src/common/utils/snowflake.service';
import { v4 as uuid } from 'uuid';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { NoteDocument } from 'src/collaborative/schemas/note.schema';
import { Model } from 'mongoose';
import { SpaceDocument } from 'src/collaborative/schemas/space.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NoteService {
  constructor(
    private readonly snowflakeService: SnowflakeService
    @InjectModel(NoteDocument.name)
    private readonly spaceModel: Model<SpaceDocument>,
  ) {}

  async create(userId: string, noteName: string) {
    const note = await this.noteRepository.save({
      id: this.snowflakeService.generateId(),
      userId,
      urlPath: uuid(),
      name: noteName,
    });
    return note.urlPath;
  }

  async findById(urlPath: string) {
    const result = await this.noteRepository.findOne({
      where: { urlPath },
    });
    return result;
  }

  async updateName(urlPath: string, newName: string): Promise<Note> {
    const note = await this.findById(urlPath);
    if (!note) {
      throw new BadRequestException(ERROR_MESSAGES.NOTE.NOT_FOUND);
    }

    try {
      note.name = newName;
      return await this.noteRepository.save(note);
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.NOTE.UPDATE_FAILED);
    }
  }

  async updateContent(urlPath: string, newContent: string): Promise<Note> {
    const note = await this.findById(urlPath);
    if (!note) {
      throw new BadRequestException(ERROR_MESSAGES.NOTE.NOT_FOUND);
    }

    try {
      note.content = newContent;
      return await this.noteRepository.save(note);
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.NOTE.UPDATE_FAILED);
    }
  }
}
