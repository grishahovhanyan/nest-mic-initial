import { Controller } from '@nestjs/common'
import { ParticipantsGrpcServiceControllerMethods } from '@app/microservices'
import { CreateParticipantDto } from './dto/participant.dto'
import { ParticipantsService } from './participants.service'

/*
####### NOTE #######
The `ParticipantsGrpcServiceControllerMethods` decorator automatically applies the `GrpcMethod` decorator to all methods in this class.
*/

@Controller()
@ParticipantsGrpcServiceControllerMethods()
export class ParticipantsGrpcController {
  constructor(private readonly participantsService: ParticipantsService) {}

  async findAllParticipants(data) {
    console.log(data, '<data findAllParticipants')
  }

  async findOneParticipant(data) {
    console.log(data, '<data findOneParticipant')
  }

  async createParticipants(data: { createParticipantsInput: CreateParticipantDto[] }) {
    return {
      results: await this.participantsService.bulkCreate(data.createParticipantsInput)
    }
  }
}
