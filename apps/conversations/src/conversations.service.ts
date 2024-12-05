import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ClientGrpc } from '@nestjs/microservices'
import { Observable, firstValueFrom } from 'rxjs'

import { Conversation, Participant } from '@app/database'
import { PARTICIPANTS_PACKAGE, USERS_PACKAGE } from '@app/microservices'
import { GetConversationsDto, CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto'
import { ConversationsRepository } from './conversations.repository'

// TODO: update
import { ApiProperty } from '@nestjs/swagger'

class CreateParticipantDto {
  @ApiProperty({ example: 3 })
  userId: number

  conversationId: number
}

// TODO: move to another place
interface UsersService {
  findUsersByIds(data: { userIds: number[] }): Observable<any>
  findOneUser(data: { userId: number }): Observable<any>
}

interface ParticipantsService {
  createParticipants(data: { createParticipantsInput: CreateParticipantDto[] }): Observable<{ results: Participant[] }>
}

@Injectable()
export class ConversationsService implements OnModuleInit {
  private usersService: UsersService
  private participantsService: ParticipantsService

  constructor(
    @Inject(USERS_PACKAGE) private readonly usersPackageClient: ClientGrpc,
    @Inject(PARTICIPANTS_PACKAGE) private readonly participantsPackageClient: ClientGrpc,
    @InjectRepository(Conversation)
    private readonly repo: Repository<Conversation>, // Can be used to create queryBuilder
    private readonly conversationsRepository: ConversationsRepository
  ) {}

  onModuleInit() {
    this.usersService = this.usersPackageClient.getService<UsersService>('UsersService')
    this.participantsService = this.participantsPackageClient.getService<ParticipantsService>('ParticipantsService')
  }

  async getUsersByIds(userIds: number[]) {
    return await firstValueFrom(this.usersService.findUsersByIds({ userIds }))
  }

  async create(createConversationInput: CreateConversationDto) {
    const { creatorId, name, userIds } = createConversationInput

    const conversation = await this.conversationsRepository.create({ creatorId, name })

    const createParticipantsInput = this.prepareCreateParticipantsInput(conversation.id, creatorId, userIds)
    const { results: participants } = await firstValueFrom(
      this.participantsService.createParticipants({ createParticipantsInput })
    )

    conversation.participants = participants

    return conversation
  }

  async getAndCount(getConversationsInput: GetConversationsDto) {
    const { page, perPage, order, userId, searchText } = getConversationsInput

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

    if (searchText) {
      qb.andWhere('conversation.name LIKE :searchPattern')
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
    return await this.conversationsRepository.findOne({ id: conversationId }, { relations: ['participants'] })
  }

  async getByConvIdAndUserId(conversationId: number, userId: number): Promise<Conversation | null> {
    return await this.repo
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndSelect('conversation.messages', 'message') // TODO:  add limit for messages
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

  async updateById(
    conversationId: number,
    updateConversationInput: UpdateConversationDto
  ): Promise<Conversation | null> {
    await this.conversationsRepository.update({ id: conversationId }, updateConversationInput)
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
