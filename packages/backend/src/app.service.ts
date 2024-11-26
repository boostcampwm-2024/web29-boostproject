import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Space, SpaceDocument } from './schema/space.schema';
@Injectable()
export class AppService {
  constructor(
    @InjectModel(Space.name) private spaceModel: Model<SpaceDocument>,
  ) {}
  async mongoSave(createSpaceDto: Partial<Space>) {
    return await this.spaceModel.create(createSpaceDto);
  }
  async mongoFind(id: string) {
    return await this.spaceModel.findById(id).exec();
  }
}
