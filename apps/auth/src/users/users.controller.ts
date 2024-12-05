import { Get, Controller, Query, UseGuards } from '@nestjs/common'
import {
  RequestUser,
  PAGE_SIZE_TYPES,
  getPageSize,
  paginatedResponse,
  USERS_SORT_FIELDS,
  getSortOrderFromQuery
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
    const page = +query.page || 1
    const perPage = getPageSize(PAGE_SIZE_TYPES.participants, +query.perPage)
    const order = getSortOrderFromQuery(query.ordering?.split(',') ?? [], USERS_SORT_FIELDS)

    const getAndCountInput: GetUsersDto = {
      page,
      perPage,
      order,
      searchText: query.searchText,
      userIdsToExclude: [currentUserId]
    }
    const { items, totalCount } = await this.usersService.getAndCount(getAndCountInput)

    return paginatedResponse(totalCount, page, perPage, items)
  }
}
