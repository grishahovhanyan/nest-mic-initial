import { ApiPropertyOptional } from '@nestjs/swagger'
import { getOrderingDescription, USERS_SORT_FIELDS } from '@app/common'
import { IOrderObject } from '@app/database'

export class GetUsersDto {
  @ApiPropertyOptional()
  page?: number

  @ApiPropertyOptional()
  perPage?: number

  @ApiPropertyOptional({ description: getOrderingDescription(USERS_SORT_FIELDS) })
  ordering?: string

  @ApiPropertyOptional({ description: 'Text for searching' })
  searchText?: string

  order?: IOrderObject
  userIdsToExclude?: number[]
  userIdsToInclude?: number[]
}

export class CreateUserDto {
  fullName: string
  email: string
  password: string
}
