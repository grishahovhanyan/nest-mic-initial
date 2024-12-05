import { Injectable } from '@nestjs/common'

import { Participant } from '@app/database'
import { IFindAndCountInput } from '@app/database'
import { GetParticipantsDto, CreateParticipantDto, UpdateParticipantDto } from './dto/participant.dto'
import { ParticipantsRepository } from './participants.repository'

@Injectable()
export class ParticipantsService {
  constructor(private readonly participantsRepository: ParticipantsRepository) {}

  async create(createParticipantInput: CreateParticipantDto): Promise<Participant> {
    return await this.participantsRepository.create(createParticipantInput)
  }

  async bulkCreate(createParticipantsInput: CreateParticipantDto[]): Promise<Participant[]> {
    return await this.participantsRepository.bulkCreate(createParticipantsInput)
  }

  async getAndCount(getParticipantsInput: GetParticipantsDto) {
    const { page, perPage, order } = getParticipantsInput

    const findAndCountInput: IFindAndCountInput<Participant> = {
      conditions: {
        // TODO
      },
      relations: [],
      take: perPage,
      skip: (page - 1) * perPage,
      order
    }
    return await this.participantsRepository.findAndCount(findAndCountInput)
  }

  async getById(participantId: number): Promise<Participant | null> {
    return await this.participantsRepository.findOne({ id: participantId }, { relations: [] })
  }

  async updateById(participantId: number, updateParticipantInput: UpdateParticipantDto): Promise<Participant | null> {
    await this.participantsRepository.update({ id: participantId }, updateParticipantInput)
    return await this.getById(participantId)
  }

  async deleteById(participantId: number) {
    await this.participantsRepository.delete({ id: participantId })
  }
}
