import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { NoteDocument } from 'src/note/note.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(NoteDocument.name)
    private readonly noteModel: Model<NoteDocument>,
  ) {}

  async create(userId: string, noteName: string) {
    const note = new this.noteModel({
      id: uuid(),
      userId,
      name: noteName,
    });
    return note.id;
  }

  async findById(id: string) {
    return this.noteModel.findOne({ id }).exec();
  }

  async updateName(id: string, newName: string) {
    const note = await this.findById(id);
    if (!note) {
      throw new BadRequestException(ERROR_MESSAGES.NOTE.NOT_FOUND);
    }

    note.name = newName;

    try {
      return await note.save();
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.NOTE.UPDATE_FAILED);
    }
  }

  async updateContent(id: string, newContent: string) {
    const note = await this.findById(id);
    if (!note) {
      throw new BadRequestException(ERROR_MESSAGES.NOTE.NOT_FOUND);
    }

    note.content = newContent;

    try {
      return await note.save();
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.NOTE.UPDATE_FAILED);
    }
  }
}
