import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ERROR_MESSAGES } from '../common/constants/error.message.constants';
import { MAX_SPACES } from '../common/constants/space.constants';
import { SpaceDocument } from './space.schema';

@Injectable()
export class SpaceValidation {
  constructor(
    @InjectModel(SpaceDocument.name)
    private readonly spaceModel: Model<SpaceDocument>,
  ) {}

  async validateSpaceLimit(userId: string) {
    const spaceCount = await this.spaceModel.countDocuments({ userId });

    if (spaceCount >= MAX_SPACES) {
      throw new Error(ERROR_MESSAGES.SPACE.LIMIT_EXCEEDED);
    }
  }

  async validateParentNodeExists(parentContextNodeId: string | null) {
    if (parentContextNodeId) {
      const space = await this.spaceModel.findOne({
        id: parentContextNodeId,
      });

      if (!space) {
        throw new Error(ERROR_MESSAGES.SPACE.PARENT_NOT_FOUND);
      }
    }
  }

  async validateSpaceExists(urlPath: string) {
    const space = await this.spaceModel.findOne({ urlPath });

    if (!space) {
      throw new Error(ERROR_MESSAGES.SPACE.NOT_FOUND);
    }

    return space;
  }
}
