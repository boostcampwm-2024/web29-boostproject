import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SpaceDocument = HydratedDocument<Space>;

@Schema()
export class Space {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  urlPath: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  parentSpaceId?: string;

  @Prop({ type: String })
  edges: string;

  @Prop({ type: String })
  nodes: string;
}

export const SpaceSchema = SchemaFactory.createForClass(Space);
