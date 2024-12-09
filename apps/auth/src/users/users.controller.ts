import { Get, Controller, Query, UseGuards } from '@nestjs/common'
import {
  RequestUser,
  PageSizeTypes,
  getPaginationAndSortOrder,
  paginatedResponse,
  USERS_SORT_FIELDS
} from '@app/common'

import { SWAGGER_TAGS, SwaggerPrivateRoute, SwaggerUsers } from '@app/swagger'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { GetUsersDto } from './dto/user.dto'

import { UsersService } from './users.service'

@SwaggerPrivateRoute(SWAGGER_TAGS.Users)
@Controller('users')
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
    const { page, perPage, order } = getPaginationAndSortOrder(query, PageSizeTypes.users, USERS_SORT_FIELDS)

    const getAndCountInput: GetUsersDto = {
      page,
      perPage,
      order,
      searchText: query.searchText,
      userIdsToExclude: [currentUserId]
    }
    const { items, totalCount } = await this.usersService.getAndCount(getAndCountInput)

    return paginatedResponse(items, totalCount, page, perPage)
  }
}
