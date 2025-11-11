import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  users: Types.ObjectId[];

  @Prop({
    type: [
      {
        sender: { type: Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    default: []
  })
  messages: {
    sender: Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
