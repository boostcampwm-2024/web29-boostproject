import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './space.entity';
import { SnowflakeService } from 'src/common/utils/snowflake.service';
import { SpaceValidationService } from './space.validation.service';
import { SpaceRedisService } from './space.redis.service';
import { SpaceServiceV2 } from './space.serviceV2';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SpaceDocument,
  SpaceSchema,
} from '../collaborative/schemas/space.schema';
import { SpaceValidationServiceV2 } from './space.validation.serviceV2';

@Module({
  imports: [
    TypeOrmModule.forFeature([Space]),
    MongooseModule.forFeature([
      { name: SpaceDocument.name, schema: SpaceSchema },
    ]),
  ],
  controllers: [SpaceController],
  providers: [
    SnowflakeService,
    SpaceServiceV2,
    SpaceValidationService,
    SpaceValidationServiceV2,
    SpaceRedisService,
  ],
  exports: [SpaceRedisService, SpaceServiceV2],
})
export class SpaceModule {}
