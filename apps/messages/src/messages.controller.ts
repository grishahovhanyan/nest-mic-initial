import { Get, Post, Query, Body, Param, Put, Delete, UseGuards } from '@nestjs/common'
import { SwaggerMessages } from '@app/swagger'

import {
  EnhancedController,
  RequestUser,
  ForbiddenException,
  NotFoundException,
  SUCCESS_RESPONSE,
  getPaginationAndSortOrder,
  PageSizeTypes,
  paginatedResponse
} from '@app/common'
import { ConversationAccessGuard } from './guards/conversation-access.guard'
import { GetMessagesDto, CreateMessageDto, UpdateMessageDto } from './dto/message.dto'

import { MessagesService } from './messages.service'

@EnhancedController('conversations/:conversationId/messages', true, 'Messages')
@UseGuards(ConversationAccessGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @SwaggerMessages.index()
  @Get()
  async index(@Param('conversationId') conversationId: number, @Query() query: GetMessagesDto) {
    const paginationAndSortOrder = getPaginationAndSortOrder(query, PageSizeTypes.messages)

    const { items, totalCount } = await this.messagesService.getAndCount({
      ...query,
      ...paginationAndSortOrder,
      conversationId
    })

    return paginatedResponse(items, totalCount, paginationAndSortOrder.page, paginationAndSortOrder.perPage)
  }

  @SwaggerMessages.create()
  @Post()
  async create(
    @RequestUser('id') currentUserId: number,
    @Param('conversationId') conversationId: number,
    @Body() createMessageDto: CreateMessageDto
  ) {
    const participant = await this.messagesService.getParticipant(conversationId, currentUserId)

    if (!participant?.id) {
      throw new NotFoundException()
    }

    const message = await this.messagesService.create({
      ...createMessageDto,
      participantId: participant.id,
      conversationId
    })

    return message
  }

  @SwaggerMessages.find()
  @Get(':id')
  async find(@Param('conversationId') conversationId: number, @Param('id') messageId: number) {
    const message = await this.messagesService.getById(messageId)

    if (!message) {
      throw new NotFoundException()
    }

    return message
  }

  @SwaggerMessages.update()
  @Put(':id')
  async update(
    @RequestUser('id') currentUserId: number,
    @Param('conversationId') conversationId: number,
    @Param('id') messageId: number,
    @Body() updateMessageDto: UpdateMessageDto
  ) {
    const message = await this.messagesService.getById(messageId)

    if (!message) {
      throw new NotFoundException()
    }

    if (message.participant.userId !== currentUserId) {
      throw new ForbiddenException()
    }

    if (!Object.keys(updateMessageDto)?.length) {
      return message
    }

    const updatedMessage = await this.messagesService.updateById(messageId, updateMessageDto)

    return updatedMessage
  }

  @SwaggerMessages.delete()
  @Delete(':id')
  async delete(
    @RequestUser('id') currentUserId: number,
    @Param('conversationId') conversationId: number,
    @Param('id') messageId: number
  ) {
    const message = await this.messagesService.getById(messageId)

    if (!message) {
      throw new NotFoundException()
    }

    if (message.participant.userId !== currentUserId) {
      throw new ForbiddenException()
    }

    await this.messagesService.deleteById(messageId)

    return SUCCESS_RESPONSE
  }
}
