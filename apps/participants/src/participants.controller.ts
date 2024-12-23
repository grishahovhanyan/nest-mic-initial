import { Get, Post, Query, Body, Param, Put, Delete } from '@nestjs/common'
import { Swagger } from '@app/swagger'

import {
  EnhancedController,
  RequestUser,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  SUCCESS_RESPONSE,
  paginatedResponse
} from '@app/common'

import { CreateParticipantDto, GetParticipantsDto, UpdateParticipantDto } from './dto/participant.dto'
import { ParticipantsService } from './participants.service'

@EnhancedController('conversations/:conversationId/participants', true, 'Participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Swagger({
    pagination: true,
    404: true
  })
  @Get()
  async index(
    @RequestUser('id') currentUserId: number,
    @Param('conversationId') conversationId: number,
    @Query() query: GetParticipantsDto
  ) {
    const participant = await this.participantsService.getByConvIdAndUserId(conversationId, currentUserId)

    if (!participant) {
      throw new NotFoundException()
    }

    const { items, totalCount } = await this.participantsService.getAndCount({
      ...query,
      conversationId,
      userId: currentUserId
    })

    return paginatedResponse(items, totalCount, query.page, query.perPage)
  }

  @Swagger({
    400: true,
    403: true,
    404: true
  })
  @Post()
  async create(
    @RequestUser('id') currentUserId: number,
    @Param('conversationId') conversationId: number,
    @Body() createParticipantDto: CreateParticipantDto
  ) {
    const currentParticipant = await this.participantsService.getByConvIdAndUserId(conversationId, currentUserId)

    if (!currentParticipant) {
      throw new NotFoundException()
    }

    if (!currentParticipant.isAdmin) {
      throw new ForbiddenException()
    }

    const existingParticipant = await this.participantsService.getByConvIdAndUserId(
      conversationId,
      createParticipantDto.userId
    )

    if (existingParticipant) {
      throw new BadRequestException('User already exists in this conversation')
    }

    const user = await this.participantsService.getUserById(createParticipantDto.userId)
    if (!user?.id) {
      throw new NotFoundException()
    }

    const participant = await this.participantsService.create({ ...createParticipantDto, conversationId })

    return participant
  }

  @Swagger({
    404: true
  })
  @Get(':id')
  async find(
    @RequestUser('id') currentUserId: number,
    @Param('conversationId') conversationId: number,
    @Param('id') participantId: number
  ) {
    const currentParticipant = await this.participantsService.getByConvIdAndUserId(conversationId, currentUserId)
    const participant = await this.participantsService.getByConvIdAndPartId(conversationId, participantId)

    if (!currentParticipant || !participant) {
      throw new NotFoundException()
    }

    return participant
  }

  @Swagger({
    400: true,
    403: true,
    404: true
  })
  @Put(':id')
  async update(
    @RequestUser('id') currentUserId: number,
    @Param('conversationId') conversationId: number,
    @Param('id') participantId: number,
    @Body() updateParticipantDto: UpdateParticipantDto
  ) {
    const currentParticipant = await this.participantsService.getByConvIdAndUserId(conversationId, currentUserId)
    const participant = await this.participantsService.getByConvIdAndPartId(conversationId, participantId)

    if (!currentParticipant || !participant) {
      throw new NotFoundException()
    }

    if (!currentParticipant.isAdmin) {
      throw new ForbiddenException()
    }

    if (!Object.keys(updateParticipantDto).length) {
      return participant
    }

    const updatedParticipant = await this.participantsService.updateById(participantId, updateParticipantDto)

    return updatedParticipant
  }

  @Swagger({
    403: true,
    404: true
  })
  @Delete(':id')
  async delete(
    @RequestUser('id') currentUserId: number,
    @Param('conversationId') conversationId: number,
    @Param('id') participantId: number
  ) {
    const currentParticipant = await this.participantsService.getByConvIdAndUserId(conversationId, currentUserId)
    const participant = await this.participantsService.getByConvIdAndPartId(conversationId, participantId)

    if (!currentParticipant || !participant) {
      throw new NotFoundException()
    }

    if (!currentParticipant.isAdmin || currentParticipant.id === participant.id) {
      throw new ForbiddenException()
    }

    await this.participantsService.deleteById(participantId)

    return SUCCESS_RESPONSE
  }
}
