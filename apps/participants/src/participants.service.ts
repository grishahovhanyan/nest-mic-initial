import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Participant } from '@app/database'
import { GetParticipantsDto, CreateParticipantDto, UpdateParticipantDto } from './dto/participant.dto'
import { ParticipantsRepository } from './participants.repository'

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly repo: Repository<Participant>,
    private readonly participantsRepository: ParticipantsRepository
  ) {}

  async create(createParticipantInput: CreateParticipantDto): Promise<Participant> {
    return await this.participantsRepository.create(createParticipantInput)
  }

  async bulkCreate(createParticipantsInput: CreateParticipantDto[]): Promise<Participant[]> {
    return await this.participantsRepository.bulkCreate(createParticipantsInput)
  }

  async getAndCount(getParticipantsInput: GetParticipantsDto) {
    const { page, perPage, order, searchText, userId, conversationId } = getParticipantsInput

    const qb = this.repo
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.user', 'user')
      .whereExists(
        this.repo
          .createQueryBuilder('participant')
          .select('1')
          .from('participants', 'p')
          .where('p.conversationId = :conversationId')
          .andWhere('p.userId = :userId')
      )
      .andWhere('participant.conversationId = :conversationId')

    if (searchText) {
      qb.andWhere('user.fullName LIKE :searchPattern')
    }

    if (order) {
      for (const [key, orderType] of Object.entries(order)) {
        qb.orderBy(`participant.${key}`, orderType)
      }
    }

    const [items, totalCount] = await qb
      .setParameter('userId', userId)
      .setParameter('conversationId', conversationId)
      .setParameter('searchPattern', `%${searchText}%`)
      .take(perPage)
      .skip((page - 1) * perPage)
      .getManyAndCount()

    return { items, totalCount }
  }

  async getById(participantId: number): Promise<Participant | null> {
    return await this.participantsRepository.findOne({ id: participantId }, { relations: ['user', 'conversation'] })
  }

  async getByConvIdAndUserId(conversationId: number, userId: number): Promise<Participant | null> {
    return await this.participantsRepository.findOne({ conversationId, userId })
  }

  async getByConvIdAndPartId(conversationId: number, participantId: number): Promise<Participant | null> {
    return await this.participantsRepository.findOne(
      { conversationId, id: participantId },
      { relations: ['user', 'conversation'] }
    )
  }

  async updateById(participantId: number, updateParticipantInput: UpdateParticipantDto): Promise<Participant | null> {
    await this.participantsRepository.update({ id: participantId }, updateParticipantInput)
    return await this.getById(participantId)
  }

  async deleteById(participantId: number) {
    await this.participantsRepository.delete({ id: participantId })
  }
}
