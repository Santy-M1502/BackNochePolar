import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './schema/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>
  ) {}

  async sendMessage(from: string, to: string, text: string) {
    // Ordenamos los usuarios para evitar duplicados (A,B y B,A se vuelve igual)
    const users = [from, to].sort();

    let conversation = await this.conversationModel.findOne({ users });

    if (!conversation) {
      conversation = await this.conversationModel.create({ users });
    }

    conversation.messages.push({
      sender: new Types.ObjectId(from),
      text,
      createdAt: new Date(),
    });

    await conversation.save();

    return text;
  }

  async getConversation(user1: string, user2: string) {
    const users = [user1, user2].sort();

    return this.conversationModel
      .findOne({ users })
      .populate('messages.sender', 'username avatar');
  }
}
