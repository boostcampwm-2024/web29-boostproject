import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BreadcrumbItem, Node, SpaceData } from 'shared/types';
import { v4 as uuid } from 'uuid';

import { SpaceDocument } from './space.schema';
import { SpaceValidationService } from './space.validation.service';

@Injectable()
export class SpaceService {
  private readonly logger = new Logger(SpaceService.name);

  constructor(
    private readonly spaceValidationService: SpaceValidationService,
    @InjectModel(SpaceDocument.name)
    private readonly spaceModel: Model<SpaceDocument>,
  ) {}

  async findById(id: string) {
    this.logger.log(`ID가 ${id}인 스페이스를 조회합니다.`);
    const result = await this.spaceModel.findOne({ id }).exec();
    return result;
  }

  async updateById(id: string, data: Partial<SpaceDocument>) {
    this.logger.log(`ID가 ${id}인 스페이스를 업데이트합니다.`);

    if (!id || !data) {
      throw new Error('유효하지 않은 매개변수입니다.');
    }

    const updatedSpace = await this.spaceModel
      .findOneAndUpdate({ id }, { $set: data }, { new: true })
      .exec();

    if (!updatedSpace) {
      throw new Error(`ID가 ${id}인 스페이스를 찾을 수 없습니다.`);
    }

    return updatedSpace;
  }

  async create(
    userId: string,
    spaceName: string,
    parentContextNodeId: string | null,
  ) {
    this.logger.log('새로운 스페이스를 생성합니다.', {
      userId,
      spaceName,
      parentContextNodeId,
    });

    const Edges: SpaceData['edges'] = {};
    const Nodes: SpaceData['nodes'] = {};
    const nodeUuid = uuid();

    const headNode: Node = {
      id: nodeUuid,
      x: 0,
      y: 0,
      type: 'head',
      name: spaceName,
      src: nodeUuid,
    };

    Nodes[headNode.id] = headNode;

    await this.spaceValidationService.validateSpaceLimit(userId);
    await this.spaceValidationService.validateParentNodeExists(
      parentContextNodeId,
    );

    const spaceDto = {
      id: nodeUuid,
      parentSpaceId:
        parentContextNodeId === null ? undefined : parentContextNodeId,
      userId,
      name: spaceName,
      edges: JSON.stringify(Edges),
      nodes: JSON.stringify(Nodes),
    };

    return this.spaceModel.create(spaceDto);
  }

  async existsById(id: string) {
    this.logger.log(`ID가 ${id}인 스페이스의 존재 여부를 확인합니다.`);

    const space = await this.spaceModel.findOne({ id }).exec();
    return !!space;
  }

  async getBreadcrumb(id: string) {
    this.logger.log(`ID가 ${id}인 스페이스의 경로를 조회합니다.`);

    const breadcrumb: BreadcrumbItem[] = [];
    let currentSpace = await this.spaceModel.findOne({ id }).exec();

    while (currentSpace) {
      breadcrumb.unshift({
        name: currentSpace.name,
        url: currentSpace.id,
      });

      if (!currentSpace.parentSpaceId) {
        break;
      }

      currentSpace = await this.spaceModel
        .findOne({ id: currentSpace.parentSpaceId })
        .exec();
    }

    return breadcrumb;
  }
}
