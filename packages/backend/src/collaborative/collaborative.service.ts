import { Injectable } from '@nestjs/common';
import { SpaceServiceV2 } from '../space/space.serviceV2';
import { SpaceRedisService } from '../space/space.redis.service';
import { NoteServiceV2 } from '../note/note.serviceV2';
import { NoteRedisService } from '../note/note.redis.service';
import { LoggerService } from 'src/note/common/logger/logger.service';

@Injectable()
export class CollaborativeService {
  constructor(
    private readonly spaceService: SpaceServiceV2,
    private readonly spaceRedisService: SpaceRedisService,
    private readonly noteService: NoteServiceV2,
    private readonly noteRedisService: NoteRedisService,
    private readonly logger: LoggerService,
  ) {}

  async updateBySpace(id: string, space: string) {
    try {
      this.logger.info('Updating space in Redis', {
        method: 'updateBySpace',
        spaceId: id,
        length: space.length,
      });

      const result = await this.spaceRedisService.setSpace(id, space);

      this.logger.info('Space updated in Redis successfully', {
        method: 'updateBySpace',
        spaceId: id,
        success: !!result,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to update space in Redis', {
        method: 'updateBySpace',
        spaceId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findBySpace(id: string) {
    try {
      this.logger.info('Finding space by ID', {
        method: 'findBySpace',
        spaceId: id,
      });

      const space = await this.spaceService.findById(id);

      this.logger.info('Space find operation completed', {
        method: 'findBySpace',
        spaceId: id,
        found: !!space,
      });

      return space;
    } catch (error) {
      this.logger.error('Failed to find space', {
        method: 'findBySpace',
        spaceId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateByNote(id: string, note: string) {
    try {
      this.logger.info('Updating note in Redis', {
        method: 'updateByNote',
        noteId: id,
        length: note.length,
      });

      const result = await this.noteRedisService.setNote(id, note);

      this.logger.info('Note updated in Redis successfully', {
        method: 'updateByNote',
        noteId: id,
        success: !!result,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to update note in Redis', {
        method: 'updateByNote',
        noteId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findByNote(id: string) {
    try {
      this.logger.info('Finding note by ID', {
        method: 'findByNote',
        noteId: id,
      });

      const note = await this.noteService.findById(id);

      this.logger.info('Note find operation completed', {
        method: 'findByNote',
        noteId: id,
        found: !!note,
      });

      return note;
    } catch (error) {
      this.logger.error('Failed to find note', {
        method: 'findByNote',
        noteId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
