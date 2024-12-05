import { Controller, Get, Post, Query, Body, Param, Put, Delete } from '@nestjs/common'
import { SWAGGER_TAGS, SwaggerPrivateRoute, SwaggerMessages } from '@app/swagger'

import {
  RequestUser,
  NotFoundException,
  MESSAGE_SORT_FIELDS,
  getSortOrderFromQuery,
  SUCCESS_RESPONSE,
  PAGE_SIZE_TYPES,
  getPageSize,
  paginatedResponse
} from '@app/common'
import { GetMessagesDto, CreateMessageDto, UpdateMessageDto } from './dto/message.dto'

import { MessagesService } from './messages.service'

@SwaggerPrivateRoute(SWAGGER_TAGS.Messages)
@Controller('conversations/:conversationId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @SwaggerMessages.index()
  @Get()
  async index(@RequestUser('id') currentUserId: number, @Query() query: GetMessagesDto) {
    const page = +query.page || 1
    const perPage = getPageSize(PAGE_SIZE_TYPES.messages, +query.perPage)
    const order = getSortOrderFromQuery(query.ordering?.split(',') ?? [], MESSAGE_SORT_FIELDS)

    const getAndCountInput = {
      page,
      perPage,
      order,
      userId: currentUserId
    }
    const { items, totalCount } = await this.messagesService.getAndCount(getAndCountInput)

    return paginatedResponse(totalCount, page, perPage, items)
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
