import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from './space.entity';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { SnowflakeService } from 'src/common/utils/snowflake.service';
import { v4 as uuid } from 'uuid';
import { SpaceData, Node, Edge } from 'shared/types';
import { SpaceValidationService } from './space.validation.service';


@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    private readonly snowflakeService: SnowflakeService,
    private readonly spaceValidationService: SpaceValidationService,
  ) {}

  async findById(urlPath: string) {
    const result = await this.spaceRepository.findOne({
      where: { urlPath },
    });
    return result;
  }

  async create(
    userId: string,
    spaceName: string,
    parentContextNodeId: string | null,
  ) {
    const Edges: SpaceData['edges'] = {};
    const Nodes: SpaceData['nodes'] = {};
    const headNode: Node = {
      id: uuid(),

      x: 0,
      y: 0,
      type: 'head',
      name: spaceName,
    };
    Nodes[headNode.id] = headNode;

    await this.spaceValidationService.validateSpaceLimit(userId);
    await this.spaceValidationService.validateParentNodeExists(
      parentContextNodeId,
    );

eDto = {
      id: this.snowflakeService.generateId(),
      parentSpaceId:
        parentContextNodeId === null ? undefined : parentContextNodeId,
      userId: userId,
      urlPath: uuid(),

      name: spaceName,
      edges: JSON.stringify(Edges),
      nodes: JSON.stringify(Nodes),
    };
    const space = await this.spaceRepository.save(spaceDto);
    return [space.urlPath];
  }
  async updateByEdges(id: string, edges: string) {
    const space = await this.findById(id);
    if (!space) {
      throw new BadRequestException(ERROR_MESSAGES.SPACE.NOT_FOUND);
    }

    try {
      space.edges = JSON.stringify(edges);
      await this.spaceRepository.save(space);
      return space;
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.SPACE.UPDATE_FAILED);
    }
  }

  async updateByNodes(id: string, nodes: string) {
    const space = await this.findById(id);
    if (!space) {
      throw new BadRequestException(ERROR_MESSAGES.SPACE.NOT_FOUND);
    }

    try {
      space.nodes = JSON.stringify(nodes);
      await this.spaceRepository.save(space);
      return space;
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.SPACE.UPDATE_FAILED);
    }
  }
}
