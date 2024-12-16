import { Get, Query, UseGuards } from '@nestjs/common'
import {
  EnhancedController,
  RequestUser,
  PageSizeTypes,
  getPaginationAndSortOrder,
  paginatedResponse,
  USERS_SORT_FIELDS
} from '@app/common'

import { SwaggerUsers } from '@app/swagger'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { GetUsersDto } from './dto/user.dto'

import { UsersService } from './users.service'

@EnhancedController('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SwaggerUsers.getMe()
  @Get('me')
  async getMe(@RequestUser('id') currentUserId: number) {
    return await this.usersService.getById(currentUserId)
  }

  @SwaggerUsers.index()
  @Get()
  async index(@RequestUser('id') currentUserId: number, @Query() query: GetUsersDto) {
    const paginationAndSortOrder = getPaginationAndSortOrder(query, PageSizeTypes.users, USERS_SORT_FIELDS)

    const { items, totalCount } = await this.usersService.getAndCount({
      ...query,
      ...paginationAndSortOrder,
      userIdsToExclude: [currentUserId]
    })

    return paginatedResponse(items, totalCount, paginationAndSortOrder.page, paginationAndSortOrder.perPage)
  }
}
