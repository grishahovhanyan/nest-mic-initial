import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  Put,
  Delete,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common'
import { SWAGGER_TAGS, SwaggerPrivateRoute, SwaggerConversations } from '@app/swagger'

import {
  RequestUser,
  getPageSize,
  getSortOrderFromQuery,
  paginatedResponse,
  CONVERSATIONS_SORT_FIELDS,
  PAGE_SIZE_TYPES,
  SUCCESS_RESPONSE
} from '@app/common'
import { CreateConversationDto, GetConversationsDto, UpdateConversationDto } from './dto/conversation.dto'

import { ConversationsService } from './conversations.service'

@SwaggerPrivateRoute(SWAGGER_TAGS.Conversations)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @SwaggerConversations.index()
  @Get()
  async index(@RequestUser('id') currentUserId: number, @Query() query: GetConversationsDto) {
    const page = +query.page || 1
    const perPage = getPageSize(PAGE_SIZE_TYPES.conversations, +query.perPage)
    const order = getSortOrderFromQuery(query.ordering?.split(',') ?? [], CONVERSATIONS_SORT_FIELDS)

    // TODO: filter read, unread
    // TODO: filter group, p2p
    const getAndCountInput = {
      page,
      perPage,
      order,
      userId: currentUserId,
      searchText: query.searchText
    }
    const { items, totalCount } = await this.conversationsService.getAndCount(getAndCountInput)

    return paginatedResponse(totalCount, page, perPage, items)
  }

  @SwaggerConversations.create()
  @Post()
  async create(@RequestUser('id') currentUserId: number, @Body() createConversationDto: CreateConversationDto) {
    const uniqueUserIds = [...new Set([...createConversationDto.userIds, currentUserId])]
    const { results: users } = await this.conversationsService.getUsersByIds(uniqueUserIds)

    if (users.length !== uniqueUserIds.length) {
      throw new NotFoundException()
    }

    const conversation = await this.conversationsService.create({ creatorId: currentUserId, ...createConversationDto })

    return conversation
  }

  @SwaggerConversations.find()
  @Get(':id')
  async find(@RequestUser('id') currentUserId: number, @Param('id') conversationId: number) {
    const conversation = await this.conversationsService.getByConvIdAndUserId(conversationId, currentUserId)

    if (!conversation) {
      throw new NotFoundException()
    }

    return conversation
  }

  @SwaggerConversations.update()
  @Put(':id')
  async update(
    @RequestUser('id') currentUserId: number,
    @Param('id') conversationId: number,
    @Body() updateConversationDto: UpdateConversationDto
  ) {
    const conversation = await this.conversationsService.getByConvIdAndUserId(conversationId, currentUserId)

    if (!conversation) {
      throw new NotFoundException()
    }

    const updatedConversation = await this.conversationsService.updateById(conversationId, updateConversationDto)

    return updatedConversation
  }

  @SwaggerConversations.delete()
  @Delete(':id')
  async delete(@RequestUser('id') currentUserId: number, @Param('id') conversationId: number) {
    const conversation = await this.conversationsService.getByConvIdAndUserId(conversationId, currentUserId)

    if (!conversation) {
      throw new NotFoundException()
    }

    const currentParticipant = conversation.participants.find(({ userId }) => userId === currentUserId)
    if (!currentParticipant.isAdmin) {
      throw new ForbiddenException()
    }

    await this.conversationsService.deleteById(conversationId)

    return SUCCESS_RESPONSE
  }
}
