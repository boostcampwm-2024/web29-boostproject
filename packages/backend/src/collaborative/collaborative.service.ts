import { BadRequestException, Injectable } from '@nestjs/common';
import { SpaceServiceV2 } from '../space/space.serviceV2';
import { SpaceRedisService } from '../space/space.redis.service';
import { NoteServiceV2 } from '../note/note.serviceV2';
import { NoteRedisService } from '../note/note.redis.service';

@Injectable()
export class collaborativeService {
  constructor(
    private readonly spaceService: SpaceServiceV2,
    private readonly spaceRedisService: SpaceRedisService,
    private readonly noteService: NoteServiceV2,
    private readonly noteRedisService: NoteRedisService,
  ) {}

  async updateBySpace(id: string, space: string) {
    return await this.spaceRedisService.setSpace(id, space);
  }
  async findBySpace(id: string) {
    return this.spaceService.findById(id);
  }

  async updateByNote(id: string, note: string) {
    return await this.noteRedisService.setNote(id, note);
  }
  async findByNote(id: string) {
    return this.noteService.findById(id);
  }
}
