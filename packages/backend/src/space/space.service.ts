import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Edge } from './interface/space.edge';
import { Node } from './interface/space.node';
import { Space } from './space.entity';
import { MAX_SPACES } from 'src/common/constants/space.constants';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { SnowflakeService } from 'src/common/utils/snowflake.service';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  generateUuid(): string {
    return uuidv4();
  }

  async create(userId: string, spaceName: string) {
    const Edges: Edge[] = [];
    const Nodes: Node[] = [];

    const userSpaceCount = await this.spaceRepository.count({
      where: { userId },
    });

    if (userSpaceCount >= MAX_SPACES) {
      throw new BadRequestException(ERROR_MESSAGES.SPACE.LIMIT_EXCEEDED);
    }

    const space = await this.spaceRepository.save({
      id: this.snowflakeService.generateId(),
      userId: userId,
      urlPath: this.generateUuid(),
      name: spaceName,
      edges: JSON.stringify(Edges),
      nodes: JSON.stringify(Nodes),
    });
    if (!space) {
    }
    return space.urlPath;
  }

  async findById(urlPath: string) {
    const result = await this.spaceRepository.findOne({
      where: { urlPath },
    });
    return result;
  }
}
