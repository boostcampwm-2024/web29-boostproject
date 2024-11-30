import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { SpaceRedisService } from './space.redis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceDocument, SpaceSchema } from './space.schema';
import { SpaceValidationService } from './space.validation.serviceV2';
import { SpaceService } from './space.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceDocument.name, schema: SpaceSchema },
    ]),
  ],
  controllers: [SpaceController],
  providers: [SpaceService, SpaceValidationService, SpaceRedisService],
  exports: [SpaceService, SpaceRedisService],
})
export class SpaceModule {}
