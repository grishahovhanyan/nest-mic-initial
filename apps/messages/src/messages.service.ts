import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

import { NotFoundException } from '@app/common'

import { IFindAndCountInput, Message } from '@app/database'
import { ConversationsGrpcServiceClient, CONVERSATIONS_PACKAGE, CONVERSATIONS_SERVICE_NAME } from '@app/microservices'
import { GetMessagesDto, CreateMessageDto, UpdateMessageDto } from './dto/message.dto'
import { MessagesRepository } from './messages.repository'

@Injectable()
export class MessagesService implements OnModuleInit {
  private conversationsService: ConversationsGrpcServiceClient

  constructor(
    @Inject(CONVERSATIONS_PACKAGE) private readonly conversationsPackageClint: ClientGrpc,
    private readonly messagesRepository: MessagesRepository
  ) {}

  onModuleInit() {
    this.conversationsService =
      this.conversationsPackageClint.getService<ConversationsGrpcServiceClient>(CONVERSATIONS_SERVICE_NAME)
  }

  async getConversation(conversationId: number, userId: number) {
    return await firstValueFrom(this.conversationsService.findOneConversation({ conversationId, userId }))
  }

  async checkConversationAccess(conversationId: number, userId: number): Promise<boolean> {
    const conversation = await this.getConversation(conversationId, userId)

    if (!conversation?.id) {
      throw new NotFoundException()
    }

    return true
  }

  async create(createMessageInput: CreateMessageDto): Promise<Message> {
    return await this.messagesRepository.create({ ...createMessageInput })
  }

  async getAndCount(getMessagesInput: GetMessagesDto) {
    const { page, perPage, order, searchText, userId, conversationId } = getMessagesInput

    await this.checkConversationAccess(conversationId, userId) // TODO: create guard for this

    console.log(searchText, '<add search by text')

    const findAndCountInput: IFindAndCountInput<Message> = {
      conditions: { conversationId },
      relations: ['participant', 'participant.user'],
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
