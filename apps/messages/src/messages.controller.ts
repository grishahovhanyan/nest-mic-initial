import { Get, Post, Query, Body, Param, Put, Delete } from '@nestjs/common'
import { SwaggerMessages } from '@app/swagger'

import {
  EnhancedController,
  RequestUser,
  NotFoundException,
  MESSAGE_SORT_FIELDS,
  SUCCESS_RESPONSE,
  getPaginationAndSortOrder,
  PageSizeTypes,
  paginatedResponse
} from '@app/common'
import { GetMessagesDto, CreateMessageDto, UpdateMessageDto } from './dto/message.dto'

import { MessagesService } from './messages.service'

@EnhancedController('conversations/:conversationId/messages', true, 'Messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @SwaggerMessages.index()
  @Get()
  async index(@RequestUser('id') currentUserId: number, @Query() query: GetMessagesDto) {
    const { page, perPage, order } = getPaginationAndSortOrder(query, PageSizeTypes.messages, MESSAGE_SORT_FIELDS)

    const getAndCountInput = {
      page,
      perPage,
      order,
      userId: currentUserId
    }
    const { items, totalCount } = await this.messagesService.getAndCount(getAndCountInput)

    return paginatedResponse(items, totalCount, page, perPage)
  }

  @SwaggerMessages.create()
  @Post()
  async create(@RequestUser('id') currentUserId: number, @Body() createMessageDto: CreateMessageDto) {
    // const message = await this.messagesService.create({ participantId: currentUserId, ...createMessageDto })

    return {
      currentUserId,
      createMessageDto
    }
  }

  @SwaggerMessages.find()
  @Get(':id')
  async find(@Param('id') messageId: number) {
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
    @Param('id') messageId: number,
    @Body() updateMessageDto: UpdateMessageDto
  ) {
    const message = await this.messagesService.getById(messageId)

    if (!message) {
      throw new NotFoundException()
    }

    const updatedMessage = await this.messagesService.updateById(messageId, updateMessageDto)

    return updatedMessage
  }

  @SwaggerMessages.delete()
  @Delete(':id')
  async delete(@RequestUser('id') currentUserId: number, @Param('id') messageId: number) {
    const message = await this.messagesService.getById(messageId)

    if (!message) {
      throw new NotFoundException()
    }

    await this.messagesService.deleteById(messageId)

    return SUCCESS_RESPONSE
  }
}
