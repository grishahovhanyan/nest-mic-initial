import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

import { Conversation } from '@app/database'
import {
  UsersGrpcServiceClient,
  ParticipantsGrpcServiceClient,
  USERS_PACKAGE,
  USERS_SERVICE_NAME,
  PARTICIPANTS_PACKAGE,
  PARTICIPANTS_SERVICE_NAME
} from '@app/microservices'
import { GetConversationsDto, CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto'
import { ConversationsRepository } from './conversations.repository'

@Injectable()
export class ConversationsService implements OnModuleInit {
  private usersService: UsersGrpcServiceClient
  private participantsService: ParticipantsGrpcServiceClient

  constructor(
    @Inject(USERS_PACKAGE) private readonly usersPackageClient: ClientGrpc,
    @Inject(PARTICIPANTS_PACKAGE) private readonly participantsPackageClient: ClientGrpc,
    @InjectRepository(Conversation)
    private readonly repo: Repository<Conversation>, // Can be used to create queryBuilder
    private readonly conversationsRepository: ConversationsRepository
  ) {}

  onModuleInit() {
    this.usersService = this.usersPackageClient.getService<UsersGrpcServiceClient>(USERS_SERVICE_NAME)
    this.participantsService =
      this.participantsPackageClient.getService<ParticipantsGrpcServiceClient>(PARTICIPANTS_SERVICE_NAME)
  }

  async getUsersByIds(userIds: number[]) {
    return await firstValueFrom(this.usersService.findUsersByIds({ userIds }))
  }

  async create(createConversationDto: CreateConversationDto) {
    const { creatorId, name, userIds } = createConversationDto

    const conversation = await this.conversationsRepository.create({ creatorId, name })

    const createParticipantsInput = this.prepareCreateParticipantsInput(conversation.id, creatorId, userIds)
    const { results: participants } = await firstValueFrom(
      this.participantsService.createParticipants({ createParticipantsInput })
    )

    conversation.participants = participants

    return conversation
  }

  async getAndCount(getConversationsDto: GetConversationsDto) {
    const { page, perPage, order, userId, searchText, groupOnly, p2pOnly } = getConversationsDto

    const qb = this.repo
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .whereExists(
        this.repo
          .createQueryBuilder('participant')
          .select('1')
          .from('participants', 'p')
          .where('p.conversationId = conversation.id')
          .andWhere('p.userId = :userId')
      )
      .leftJoinAndSelect('participant.user', 'user')

    if (searchText) {
      qb.andWhere('conversation.name LIKE :searchPattern')
    }

    if (groupOnly) {
      qb.andWhere('conversation.isGroup = TRUE')
    }

    if (p2pOnly) {
      qb.andWhere('conversation.isGroup = FALSE')
    }

    if (order) {
      for (const [key, orderType] of Object.entries(order)) {
        qb.orderBy(`conversation.${key}`, orderType)
      }
    }

    const [items, totalCount] = await qb
      .setParameter('userId', userId)
      .setParameter('searchPattern', `%${searchText}%`)
      .take(perPage)
      .skip((page - 1) * perPage)
      .getManyAndCount()

    return { items, totalCount }
  }

  async getById(conversationId: number): Promise<Conversation | null> {
    return await this.conversationsRepository.findOne(
      { id: conversationId },
      { relations: ['participants', 'participants.user'] }
    )
  }

  async getByConvIdAndUserId(conversationId: number, userId: number): Promise<Conversation | null> {
    return await this.repo
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .whereExists(
        this.repo
          .createQueryBuilder('participant')
          .select('1')
          .from('participants', 'p')
          .where('p.conversationId = conversation.id')
          .andWhere('p.userId = :userId')
      )
      .andWhere('conversation.id = :conversationId')
      .setParameter('userId', userId)
      .setParameter('conversationId', conversationId)
      .getOne()
  }

  async updateById(conversationId: number, updateConversationDto: UpdateConversationDto): Promise<Conversation | null> {
    await this.conversationsRepository.update({ id: conversationId }, updateConversationDto)
    return await this.getById(conversationId)
  }

  async deleteById(conversationId: number) {
    await this.conversationsRepository.delete({ id: conversationId })
  }

  prepareCreateParticipantsInput(conversationId: number, creatorId: number, userIds: number[]) {
    return [...new Set([...userIds, creatorId])].map((userId: number) => ({
      userId,
      conversationId,
      isAdmin: userId === creatorId
    }))
  }
}
