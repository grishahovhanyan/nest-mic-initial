import { IOrderObject } from '@app/database'
import { getOrderingDescription, USERS_SORT_FIELDS } from '@app/common'
import { NumberFieldOptional, StringFieldOptional } from '@app/common/validators'

export class GetUsersDto {
  @NumberFieldOptional({ positive: true })
  page?: number

  @NumberFieldOptional({ positive: true })
  perPage?: number

  @StringFieldOptional({ description: getOrderingDescription(USERS_SORT_FIELDS) })
  ordering?: string

  @StringFieldOptional({ description: 'Text for searching' })
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
