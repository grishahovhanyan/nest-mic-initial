import { Injectable } from '@nestjs/common'

import { IFindAndCountInput, Message } from '@app/database'
import { GetMessagesDto, CreateMessageDto, UpdateMessageDto } from './dto/message.dto'

import { MessagesRepository } from './messages.repository'

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  prepareCreateMessagesInput(conversationId: number, creatorId: number, userIds: number[]) {
    return [
      { userId: creatorId, conversationId, isAdmin: true },
      ...userIds.map((userId) => ({
        userId,
        conversationId
      }))
    ]
  }

  async create(createMessageInput: CreateMessageDto): Promise<Message> {
    return await this.messagesRepository.create({ ...createMessageInput })
  }

  async bulkCreate(createMessagesInput: CreateMessageDto[]): Promise<Message[]> {
    return await this.messagesRepository.bulkCreate(createMessagesInput)
  }

  async getAndCount(getMessagesInput: GetMessagesDto) {
    const { page, perPage, order } = getMessagesInput

    const findAndCountInput: IFindAndCountInput<Message> = {
      conditions: {
        // TODO
      },
      relations: [],
      take: perPage,
      skip: (page - 1) * perPage,
      order
    }
    return await this.messagesRepository.findAndCount(findAndCountInput)
  }

  async getById(messageId: number): Promise<Message | null> {
    return await this.messagesRepository.findOne({ id: messageId }, { relations: [] })
  }

  async updateById(messageId: number, updateMessageInput: UpdateMessageDto): Promise<Message | null> {
    await this.messagesRepository.update({ id: messageId }, updateMessageInput)
    return await this.getById(messageId)
  }

  async deleteById(messageId: number) {
    await this.messagesRepository.delete({ id: messageId })
  }
}
