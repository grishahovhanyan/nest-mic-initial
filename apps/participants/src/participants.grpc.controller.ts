import { GrpcMethod } from '@nestjs/microservices'
import { Controller } from '@nestjs/common'
import { CreateParticipantDto } from './dto/participant.dto'
import { ParticipantsService } from './participants.service'

@Controller()
export class ParticipantsGrpcController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @GrpcMethod('ParticipantsService', 'CreateParticipants')
  async createParticipants(data: { createParticipantsInput: CreateParticipantDto[] }) {
    return {
      results: await this.participantsService.bulkCreate(data.createParticipantsInput)
    }
  }
}
