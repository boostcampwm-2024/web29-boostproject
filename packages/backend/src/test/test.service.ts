import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Space as SpaceEntity } from './space.test.entity';
import { Note as NoteEntity } from './note.test.entity';
import { SpaceDocument } from 'src/space/space.schema';
import { NoteDocument } from 'src/note/note.schema';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(SpaceEntity)
    private spaceRepository: Repository<SpaceEntity>,
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
    @InjectModel(SpaceDocument.name)
    private spaceModel: Model<SpaceDocument>,
    @InjectModel(NoteDocument.name)
    private noteModel: Model<NoteDocument>,
  ) {}

  async findSpaceByIdSQL(id: string) {
    return this.spaceRepository.findOne({ where: { id } });
  }

  async findNoteByIdSQL(id: string) {
    return this.noteRepository.findOne({ where: { id } });
  }

  async createSpaceSQL(data: any) {
    const space = this.spaceRepository.create(data);
    return this.spaceRepository.save(space);
  }

  async createNoteSQL(data: any) {
    const note = this.noteRepository.create(data);
    return this.noteRepository.save(note);
  }

  async findSpaceByIdMongo(id: string) {
    return this.spaceModel.findOne({ id }).exec();
  }

  async findNoteByIdMongo(id: string) {
    return this.noteModel.findOne({ id }).exec();
  }

  async createSpaceMongo(data: any) {
    const space = new this.spaceModel(data);
    return space.save();
  }

  async createNoteMongo(data: any) {
    const note = new this.noteModel(data);
    return note.save();
  }
}
