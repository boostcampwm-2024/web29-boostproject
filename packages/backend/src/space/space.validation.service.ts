import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Space } from './space.entity';
import { ERROR_MESSAGES } from 'src/note/common/constants/error.message.constants';
import { MAX_SPACES } from 'src/note/common/constants/space.constants';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SpaceValidationService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
  ) {}

  async validateSpaceLimit(userId: string) {
    const spaceCount = await this.spaceRepository.count({ where: { userId } });
    if (spaceCount >= MAX_SPACES) {
      throw new Error(ERROR_MESSAGES.SPACE.LIMIT_EXCEEDED);
    }
  }

  async validateParentNodeExists(parentContextNodeId: string | null) {
    if (parentContextNodeId) {
      const space = await this.spaceRepository.findOne({
        where: { urlPath: parentContextNodeId },
      });
      if (!space) {
        throw new Error(ERROR_MESSAGES.SPACE.PARENT_NOT_FOUND);
      }
    }
  }

  async validateSpaceExists(urlPath: string) {
    const space = await this.spaceRepository.findOne({
      where: { urlPath },
    });
    if (!space) {
      throw new Error(ERROR_MESSAGES.SPACE.NOT_FOUND);
    }
    return space;
  }
}
