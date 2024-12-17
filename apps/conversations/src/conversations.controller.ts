import { Get, Post, Query, Body, Param, Put, Delete, ForbiddenException } from '@nestjs/common'
import { SwaggerConversations } from '@app/swagger'

import { EnhancedController, RequestUser, NotFoundException, paginatedResponse, SUCCESS_RESPONSE } from '@app/common'
import { CreateConversationDto, GetConversationsDto, UpdateConversationDto } from './dto/conversation.dto'

import { ConversationsService } from './conversations.service'

@EnhancedController('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @SwaggerConversations.index()
  @Get()
  async index(@RequestUser('id') currentUserId: number, @Query() query: GetConversationsDto) {
    const { items, totalCount } = await this.conversationsService.getAndCount({
      ...query,
      order: typeof query.order === 'string' ? JSON.parse(query.order) : {},
      userId: currentUserId
    })

    return paginatedResponse(items, totalCount, query.page, query.perPage)
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
