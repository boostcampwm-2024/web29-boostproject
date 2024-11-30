import { Controller, Get, Logger, Param, Version } from '@nestjs/common';
import { CollaborativeService } from './collaborative.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('space')
@Controller('collaborative')
export class CollaborativeController {
  private readonly logger = new Logger(CollaborativeController.name);
  constructor(private readonly collaborativeService: CollaborativeService) {}

  @Version('1')
  @Get('space/:id')
  async getSpace(@Param('id') id: string) {
    const space = await this.collaborativeService.findBySpace(id);
    if (!space) return false;
    const parsedSpace = {
      ...space.toObject(),
      edges: JSON.parse(space.edges),
      nodes: JSON.parse(space.nodes),
    };

    this.logger.log(`edges: ${parsedSpace.edges}`);
    this.logger.log(`nodes: ${parsedSpace.nodes}`);
    return parsedSpace;
  }
  @Version('1')
  @Get('note/:id')
  async getNote(@Param('id') id: string) {
    const note = await this.collaborativeService.findByNote(id);
    if (!note) return false;
    const noteObject = note.toObject();
    if (noteObject.content) {
      const updates = new Uint8Array(Buffer.from(noteObject.content, 'base64'));
      return updates;
    }
  }
  @Version('1')
  @Get('space/has/:id')
  async hasSpace(@Param('id') id: string) {
    const result = await this.collaborativeService.hasBySpace(id);
    return result;
  }
  @Version('1')
  @Get('note/has/:id')
  async hasNote(@Param('id') id: string) {
    const result = await this.collaborativeService.hasByNote(id);
    return result;
  }

  @Version('1')
  @Get('space/set/:id')
  async setSpace(@Param('id') id: string, data) {
    const space = await this.collaborativeService.setBySpace(id, data);
    return space;
  }
  @Version('1')
  @Get('note/set/:id')
  async setNote(@Param('id') id: string, data) {
    const note = await this.collaborativeService.setByNote(id, data);
  }
}
