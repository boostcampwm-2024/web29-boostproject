import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { ERROR_MESSAGES } from '../common/constants/error.message.constants';
import { NoteService } from '../note/note.service';
import { SpaceService } from '../space/space.service';

@Injectable()
export class CollaborativeService {
  private readonly logger = new Logger(CollaborativeService.name);

  constructor(
    private readonly spaceService: SpaceService,
    private readonly noteService: NoteService,
  ) {}

  async updateBySpace(id: string, space: string) {
    try {
      this.logger.log('스페이스 정보 업데이트 시작', {
        method: 'updateBySpace',
        spaceId: id,
        length: space.length,
      });

      let spaceJsonData;
      try {
        spaceJsonData = JSON.parse(space);
      } catch (error) {
        throw new Error(`유효하지 않은 스페이스 JSON 데이터: ${error.message}`);
      }

      const updateDto = {
        edges: JSON.stringify(spaceJsonData.edges),
        nodes: JSON.stringify(spaceJsonData.nodes),
      };

      const result = await this.spaceService.updateById(id, updateDto);

      this.logger.log('스페이스 정보 업데이트 완료', {
        method: 'updateBySpace',
        spaceId: id,
        success: !!result,
      });

      return result;
    } catch (error) {
      this.logger.error('스페이스 정보 업데이트 실패', {
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
      this.logger.log('스페이스 정보 조회 시작', {
        method: 'findBySpace',
        spaceId: id,
      });

      const space = await this.spaceService.findById(id);

      this.logger.log('스페이스 정보 조회 완료', {
        method: 'findBySpace',
        spaceId: id,
        found: !!space,
      });

      return space;
    } catch (error) {
      this.logger.error('스페이스 정보 조회 실패', {
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
      this.logger.log('노트 내용 업데이트 시작', {
        method: 'updateByNote',
        noteId: id,
        length: note.length,
      });

      const updatedNote = await this.noteService.updateContent(id, note);

      this.logger.log('노트 내용 업데이트 완료', {
        method: 'updateByNote',
        noteId: id,
      });

      return updatedNote;
    } catch (error) {
      this.logger.error('노트 내용 업데이트 실패', {
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
      this.logger.log('노트 조회 시작', {
        method: 'findByNote',
        noteId: id,
      });

      const note = await this.noteService.findById(id);

      this.logger.log('노트 조회 완료', {
        method: 'findByNote',
        noteId: id,
        found: !!note,
      });

      return note;
    } catch (error) {
      this.logger.error('노트 조회 실패', {
        method: 'findByNote',
        noteId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
