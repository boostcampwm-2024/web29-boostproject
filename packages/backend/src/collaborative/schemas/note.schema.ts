import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class NoteDocument extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  urlPath: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, default: null })
  content: string | null;
}

export const NoteSchema = SchemaFactory.createForClass(NoteDocument);
