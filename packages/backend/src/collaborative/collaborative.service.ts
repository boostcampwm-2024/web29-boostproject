import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SpaceService } from '../space/space.service';
import { SpaceRedisService } from '../space/space.redis.service';
import { NoteService } from '../note/note.service';
import { NoteRedisService } from '../note/note.redis.service';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';

@Injectable()
export class CollaborativeService {
  private readonly logger = new Logger(CollaborativeService.name);
  constructor(
    private readonly spaceService: SpaceService,
    private readonly spaceRedisService: SpaceRedisService,
    private readonly noteService: NoteService,
    private readonly noteRedisService: NoteRedisService,
  ) {}

  async setBySpace(id: string, data: any) {
    this.logger.log('set space in Redis', {
      method: 'setBySpace',
      spaceId: id,
    });
    return await this.spaceRedisService.setSpace(id, data);
  }
  async setByNote(id: string, data: any) {
    this.logger.log('set note in Redis', {
      method: 'setBynote',
      spaceId: id,
    });
    return await this.noteRedisService.setNote(id, data);
  }
  async hasBySpace(id: string) {
    this.logger.log('has space in Redis', {
      method: 'updateBySpace',
      spaceId: id,
    });
    return await this.spaceRedisService.hasSpace(id);
  }
  async hasByNote(id: string) {
    this.logger.log('has note in Redis', {
      method: 'hasBynote',
      spaceId: id,
    });
    const result = this.noteRedisService.hasNote(id);
    return await this.noteService.findById(id);
  }
  async updateBySpace(id: string, space: string) {
    try {
      this.logger.log('Updating space in Redis', {
        method: 'updateBySpace',
        spaceId: id,
        length: space.length,
      });

      let spaceJsonData;
      try {
        spaceJsonData = JSON.parse(space);
      } catch (error) {
        throw new Error(`Invalid space JSON data: ${error.message}`);
      }

      const updateDto = {
        edges: spaceJsonData.edges,
        nodes: spaceJsonData.nodes,
      };

      const result = await this.spaceService.updateById(id, updateDto);

      this.logger.log('Space updated in Redis successfully', {
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
      this.logger.log('Finding space by ID', {
        method: 'findBySpace',
        spaceId: id,
      });

      const space = this.spaceService.findById(id);

      this.logger.log('Space find operation completed', {
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
      this.logger.log('Updating note in Redis and MongoDB', {
        method: 'updateByNote',
        noteId: id,
        length: note.length,
      });

      await this.noteRedisService.setNote(id, note);

      const updatedNote = await this.noteService.updateContent(id, note);

      this.logger.log('Note successfully updated in Redis and MongoDB', {
        method: 'updateByNote',
        noteId: id,
      });

      return updatedNote;
    } catch (error) {
      this.logger.error('Failed to update note', {
        method: 'updateByNote',
        noteId: id,
        error: error.message,
        stack: error.stack,
      });
      throw new BadRequestException(ERROR_MESSAGES.NOTE.UPDATE_FAILED);
    }
  }

  async findByNote(id: string) {
    try {
      this.logger.log('Finding note by ID', {
        method: 'findByNote',
        noteId: id,
      });

      const note = await this.noteService.findById(id);

      this.logger.log('Note find operation completed', {
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
