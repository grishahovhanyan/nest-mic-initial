import { Controller, Get, Post, Query, Body, Param, Put, Delete } from '@nestjs/common'
import { SWAGGER_TAGS, SwaggerPrivateRoute, SwaggerParticipants } from '@app/swagger'

import {
  RequestUser,
  NotFoundException,
  PAGE_SIZE_TYPES,
  SUCCESS_RESPONSE,
  getPageSize,
  paginatedResponse
} from '@app/common'

import { CreateParticipantDto, GetParticipantsDto, UpdateParticipantDto } from './dto/participant.dto'
import { ParticipantsService } from './participants.service'

@SwaggerPrivateRoute(SWAGGER_TAGS.Participants)
@Controller('conversations/:conversationId/participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @SwaggerParticipants.index()
  @Get()
  async index(@RequestUser('id') currentUserId: number, @Query() query: GetParticipantsDto) {
    const page = +query.page || 1
    const perPage = getPageSize(PAGE_SIZE_TYPES.participants, +query.perPage)

    const getAndCountInput = {
      page,
      perPage,
      userId: currentUserId
    }
    const { items, totalCount } = await this.participantsService.getAndCount(getAndCountInput)

    return paginatedResponse(totalCount, page, perPage, items)
  }

  @SwaggerParticipants.create()
  @Post()
  async create(
    @RequestUser('id') currentUserId: number,
    @Param('conversationId') conversationId: number,
    @Body() createParticipantDto: CreateParticipantDto
  ) {
    const participant = await this.participantsService.create({ conversationId: 1, ...createParticipantDto })

    return participant
  }

  @SwaggerParticipants.find()
  @Get(':id')
  async find(@Param('id') participantId: number) {
    const participant = await this.participantsService.getById(participantId)

    if (!participant) {
      throw new NotFoundException()
    }

    return participant
  }

  @SwaggerParticipants.update()
  @Put(':id')
  async update(
    @RequestUser('id') currentUserId: number,
    @Param('id') participantId: number,
    @Body() updateParticipantDto: UpdateParticipantDto
  ) {
    const participant = await this.participantsService.getById(participantId)

    if (!participant) {
      throw new NotFoundException()
    }

    const updatedParticipant = await this.participantsService.updateById(participantId, updateParticipantDto)

    return updatedParticipant
  }

  @SwaggerParticipants.delete()
  @Delete(':id')
  async delete(@RequestUser('id') currentUserId: number, @Param('id') participantId: number) {
    const participant = await this.participantsService.getById(participantId)

    if (!participant) {
      throw new NotFoundException()
    }

    await this.participantsService.deleteById(participantId)

    return SUCCESS_RESPONSE
  }
}
