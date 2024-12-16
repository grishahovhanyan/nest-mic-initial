import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { FindOptionsWhere, Like } from 'typeorm'
import { firstValueFrom } from 'rxjs'

import { NotFoundException } from '@app/common'
import { IFindAndCountInput, Message, Participant } from '@app/database'
import {
  ConversationsGrpcServiceClient,
  CONVERSATIONS_PACKAGE,
  CONVERSATIONS_SERVICE_NAME,
  ParticipantsGrpcServiceClient,
  PARTICIPANTS_PACKAGE,
  PARTICIPANTS_SERVICE_NAME
} from '@app/microservices'
import { GetMessagesDto, CreateMessageDto, UpdateMessageDto } from './dto/message.dto'
import { MessagesRepository } from './messages.repository'

@Injectable()
export class MessagesService implements OnModuleInit {
  private conversationsService: ConversationsGrpcServiceClient
  private participantsService: ParticipantsGrpcServiceClient

  constructor(
    @Inject(CONVERSATIONS_PACKAGE) private readonly conversationsPackageClint: ClientGrpc,
    @Inject(PARTICIPANTS_PACKAGE) private readonly participantsPackageClint: ClientGrpc,
    private readonly messagesRepository: MessagesRepository
  ) {}

  onModuleInit() {
    this.conversationsService =
      this.conversationsPackageClint.getService<ConversationsGrpcServiceClient>(CONVERSATIONS_SERVICE_NAME)
    this.participantsService =
      this.participantsPackageClint.getService<ParticipantsGrpcServiceClient>(PARTICIPANTS_SERVICE_NAME)
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

  async getParticipant(conversationId: number, userId: number): Promise<Participant | null> {
    const participant = await firstValueFrom(this.participantsService.findOneParticipant({ conversationId, userId }))

    if (!participant?.id) {
      return null
    }

    return participant
  }

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    return await this.messagesRepository.create({ ...createMessageDto })
  }

  async getAndCount(getMessagesDto: GetMessagesDto) {
    const { page, perPage, order, searchText, conversationId } = getMessagesDto

    const conditions: FindOptionsWhere<Message> = { conversationId }

    if (searchText) {
      conditions.body = Like(`%${searchText.trim()}%`)
    }

    const findAndCountInput: IFindAndCountInput<Message> = {
      conditions,
      relations: ['participant', 'participant.user'],
      take: perPage,
      skip: (page - 1) * perPage,
      order
    }
    return await this.messagesRepository.findAndCount(findAndCountInput)
  }

  async getById(messageId: number): Promise<Message | null> {
    return await this.messagesRepository.findOne({ id: messageId }, { relations: ['participant', 'participant.user'] })
  }

  async updateById(messageId: number, updateMessageDto: UpdateMessageDto): Promise<Message | null> {
    await this.messagesRepository.update({ id: messageId }, updateMessageDto)
    return await this.getById(messageId)
  }

  async deleteById(messageId: number): Promise<void> {
    await this.messagesRepository.delete({ id: messageId })
  }
}
