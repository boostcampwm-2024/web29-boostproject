import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from './space.entity';
import { ERROR_MESSAGES } from 'src/note/common/constants/error.message.constants';
import { SnowflakeService } from 'src/note/common/utils/snowflake.service';
import { v4 as uuid } from 'uuid';
import { SpaceData, Node } from 'shared/types';
import { SpaceValidationService } from './space.validation.service';
import { LoggerService } from 'src/note/common/logger/logger.service';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
    private readonly snowflakeService: SnowflakeService,
    private readonly spaceValidationService: SpaceValidationService,
    private readonly logger: LoggerService,
  ) {}

  async findByUrlPath(urlPath: string) {
    try {
      this.logger.info('Finding space by URL path', {
        method: 'findByUrlPath',
        urlPath,
      });

      const result = await this.spaceRepository.findOne({
        where: { urlPath },
      });

      this.logger.info('Space find operation completed', {
        method: 'findByUrlPath',
        urlPath,
        found: !!result,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to find space by URL path', {
        method: 'findByUrlPath',
        urlPath,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async create(
    userId: string,
    spaceName: string,
    parentContextNodeId: string | null,
  ) {
    try {
      this.logger.info('Creating new space', {
        method: 'create',
        userId,
        spaceName,
        parentContextNodeId,
      });

      const Edges: SpaceData['edges'] = {};
      const Nodes: SpaceData['nodes'] = {};
      const headNode: Node = {
        id: uuid(),
        x: 0,
        y: 0,
        type: 'head',
        name: spaceName,
        src: uuid(),
      };
      Nodes[headNode.id] = headNode;

      await this.spaceValidationService.validateSpaceLimit(userId);
      await this.spaceValidationService.validateParentNodeExists(
        parentContextNodeId,
      );

      const spaceDto = {
        id: this.snowflakeService.generateId(),
        parentSpaceId:
          parentContextNodeId === null ? undefined : parentContextNodeId,
        userId: userId,
        urlPath: headNode.src,
        name: spaceName,
        edges: JSON.stringify(Edges),
        nodes: JSON.stringify(Nodes),
      };

      const space = await this.spaceRepository.save(spaceDto);

      this.logger.info('Space created successfully', {
        method: 'create',
        spaceId: space.id,
        urlPath: space.urlPath,
      });

      return [space.urlPath];
    } catch (error) {
      this.logger.error('Failed to create space', {
        method: 'create',
        userId,
        spaceName,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateByEdges(id: string, edges: string) {
    try {
      this.logger.info('Updating space edges', {
        method: 'updateByEdges',
        spaceId: id,
        edgesLength: edges.length,
      });

      const space = await this.findByUrlPath(id);
      if (!space) {
        this.logger.error('Space not found for edge update', {
          method: 'updateByEdges',
          spaceId: id,
        });
        throw new BadRequestException(ERROR_MESSAGES.SPACE.NOT_FOUND);
      }

      space.edges = JSON.stringify(edges);
      const updatedSpace = await this.spaceRepository.save(space);

      this.logger.info('Space edges updated successfully', {
        method: 'updateByEdges',
        spaceId: id,
      });

      return updatedSpace;
    } catch (error) {
      this.logger.error('Failed to update space edges', {
        method: 'updateByEdges',
        spaceId: id,
        error: error.message,
        stack: error.stack,
      });
      throw new BadRequestException(ERROR_MESSAGES.SPACE.UPDATE_FAILED);
    }
  }

  async updateByNodes(id: string, nodes: string) {
    try {
      this.logger.info('Updating space nodes', {
        method: 'updateByNodes',
        spaceId: id,
        nodesLength: nodes.length,
      });

      const space = await this.findByUrlPath(id);
      if (!space) {
        this.logger.error('Space not found for node update', {
          method: 'updateByNodes',
          spaceId: id,
        });
        throw new BadRequestException(ERROR_MESSAGES.SPACE.NOT_FOUND);
      }

      space.nodes = JSON.stringify(nodes);
      const updatedSpace = await this.spaceRepository.save(space);

      this.logger.info('Space nodes updated successfully', {
        method: 'updateByNodes',
        spaceId: id,
      });

      return updatedSpace;
    } catch (error) {
      this.logger.error('Failed to update space nodes', {
        method: 'updateByNodes',
        spaceId: id,
        error: error.message,
        stack: error.stack,
      });
      throw new BadRequestException(ERROR_MESSAGES.SPACE.UPDATE_FAILED);
    }
  }

  async existsByUrlPath(urlPath: string) {
    try {
      this.logger.info('Checking space existence by URL path', {
        method: 'existsByUrlPath',
        urlPath,
      });

      const count = await this.spaceRepository.count({
        where: [{ urlPath }],
      });

      this.logger.info('Space existence check completed', {
        method: 'existsByUrlPath',
        urlPath,
        exists: count > 0,
      });

      return count > 0;
    } catch (error) {
      this.logger.error('Failed to check space existence', {
        method: 'existsByUrlPath',
        urlPath,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
