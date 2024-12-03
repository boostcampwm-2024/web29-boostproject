import { Module } from '@nestjs/common';

import { CollaborativeModule } from '../collaborative/collaborative.module';
import { NoteModule } from '../note/note.module';
import { SpaceModule } from '../space/space.module';
import { YjsGateway } from './yjs.gateway';

@Module({
  imports: [SpaceModule, NoteModule, CollaborativeModule],
  providers: [YjsGateway],
})
export class YjsModule {}
