import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SpaceDocument } from 'src/collaborative/schemas/space.schema';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { MAX_SPACES } from 'src/common/constants/space.constants';

@Injectable()
export class SpaceValidationServiceV2 {
  constructor(
    @InjectModel('SpaceDocument')
    private readonly spaceModel: Model<SpaceDocument>,
  ) {}

  /**
   * 사용자의 공간 제한을 확인
   * @param userId 사용자 ID
   */
  async validateSpaceLimit(userId: string) {
    const spaceCount = await this.spaceModel.countDocuments({ userId });
    if (spaceCount >= MAX_SPACES) {
      throw new Error(ERROR_MESSAGES.SPACE.LIMIT_EXCEEDED);
    }
  }

  /**
   * 부모 노드가 존재하는지 확인
   * @param parentContextNodeId 부모 노드 ID
   */
  async validateParentNodeExists(parentContextNodeId: string | null) {
    if (parentContextNodeId) {
      const space = await this.spaceModel.findOne({
        urlPath: parentContextNodeId,
      });
      if (!space) {
        throw new Error(ERROR_MESSAGES.SPACE.PARENT_NOT_FOUND);
      }
    }
  }

  /**
   * 지정된 URL 경로의 공간이 존재하는지 확인
   * @param urlPath URL 경로
   */
  async validateSpaceExists(urlPath: string) {
    const space = await this.spaceModel.findOne({ urlPath });
    if (!space) {
      throw new Error(ERROR_MESSAGES.SPACE.NOT_FOUND);
    }
    return space;
  }
}
