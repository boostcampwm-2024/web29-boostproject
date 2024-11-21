import { Module } from '@nestjs/common';
import { ContentService } from './content.service';

@Module({
  providers: [ContentService]
})
export class ContentModule {}
