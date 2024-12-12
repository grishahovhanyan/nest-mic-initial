import { Controller } from '@nestjs/common'
import { CreateParticipantDto, ParticipantsGrpcServiceControllerMethods } from '@app/microservices'
import { ParticipantsService } from './participants.service'

/*
####### NOTE #######
The `ParticipantsGrpcServiceControllerMethods` decorator automatically applies the `GrpcMethod` decorator to all methods in this class.
*/

@Controller()
@ParticipantsGrpcServiceControllerMethods()
export class ParticipantsGrpcController {
  constructor(private readonly participantsService: ParticipantsService) {}

  // TODO: remove if not used
  async findAllParticipants(data) {
    console.log(data, '<data findAllParticipants')
  }

  async findOneParticipant(data) {
    console.log(data, '<data findOneParticipant')
  }

  async createParticipants(createParticipantsDto: { createParticipantsInput: CreateParticipantDto[] }) {
    const { createParticipantsInput } = createParticipantsDto
    return {
      results: await this.participantsService.bulkCreate(createParticipantsInput)
    }
  }
}
