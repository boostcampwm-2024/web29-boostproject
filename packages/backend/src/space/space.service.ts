import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BreadcrumbItem, Node, SpaceData } from 'shared/types';
import { v4 as uuid } from 'uuid';

import { SpaceDocument } from './space.schema';
import { SpaceValidation } from './space.validation.service';
import { NoteService } from 'src/note/note.service';

@Injectable()
export class SpaceService {
  private readonly logger = new Logger(SpaceService.name);

  constructor(
    private readonly spaceValidation: SpaceValidation,
    private readonly noteService: NoteService,
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

    await this.spaceValidation.validateSpaceLimit(userId);
    await this.spaceValidation.validateParentNodeExists(parentContextNodeId);

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

  async deleteById(id: string) {
    this.logger.log(`ID가 ${id}인 스페이스와 그 하위 노드를 삭제합니다.`);

    const space = await this.spaceModel.findOne({ id }).exec();

    if (!space) {
      this.logger.warn(`삭제 실패: ID가 ${id}인 스페이스를 찾을 수 없습니다.`);
      throw new Error(`ID가 ${id}인 스페이스를 찾을 수 없습니다.`);
    }

    let nodes: Record<string, Node>;
    try {
      nodes = JSON.parse(space.nodes);
      this.logger.debug(`노드 데이터 확인: ${JSON.stringify(nodes)}`);
    } catch (error) {
      this.logger.error(`노드 데이터 파싱 실패 - ID: ${id}`, error.stack);
      throw new Error('노드 데이터 파싱 중 오류가 발생했습니다.');
    }

    for (const nodeId in nodes) {
      const node = nodes[nodeId];
      this.logger.debug(
        `노드 순회 - ID: ${nodeId}, 데이터: ${JSON.stringify(node)}`,
      );

      switch (node.type) {
        case 'note':
          this.logger.log(`노트 노드 삭제 - ID: ${node.id}`);
          await this.noteService.deleteById(node.id);
          break;

        case 'subspace':
          if (!node.src) {
            this.logger.warn(
              `서브스페이스 노드에 src가 없습니다 - ID: ${node.id}`,
            );
            continue;
          }
          this.logger.log(
            `서브스페이스 노드 삭제 - ID: ${node.id}, 하위 스페이스 ID: ${node.src}`,
          );
          await this.deleteById(node.src);
          break;

        default:
          this.logger.log(
            `노드 ID: ${node.id}는 특별한 삭제 작업이 필요하지 않습니다.`,
          );
          break;
      }
    }

    this.logger.log(`스페이스 삭제 - ID: ${id}`);
    const result = await this.spaceModel.deleteOne({ id }).exec();

    if (result.deletedCount === 0) {
      this.logger.warn(`스페이스 삭제 실패 - ID: ${id}`);
      throw new Error(`ID가 ${id}인 스페이스를 삭제할 수 없습니다.`);
    }

    this.logger.log(`ID가 ${id}인 스페이스 및 하위 노드 삭제 완료.`);
    return {
      success: true,
      message: '스페이스와 하위 노드가 성공적으로 삭제되었습니다.',
    };
  }
}
