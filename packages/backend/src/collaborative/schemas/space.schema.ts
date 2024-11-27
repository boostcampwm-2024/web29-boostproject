import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class SpaceDocument extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ type: String, default: null })
  parentSpaceId: string | null;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  urlPath: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: String })
  edges: string;

  @Prop({ required: true, type: String })
  nodes: string;
}

export const SpaceSchema = SchemaFactory.createForClass(SpaceDocument);
