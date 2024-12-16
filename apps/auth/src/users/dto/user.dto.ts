import { IOrderObject } from '@app/database'
import { PaginationDto, getOrderingDescription, USERS_SORT_FIELDS } from '@app/common'
import { StringFieldOptional } from '@app/common/validators'

export class GetUsersDto extends PaginationDto {
  @StringFieldOptional({ description: getOrderingDescription(USERS_SORT_FIELDS) }) // TODO: handle this // avoid using  getOrderingDescription
  ordering?: string

  @StringFieldOptional({ description: 'Text for searching' })
  searchText?: string

  order?: IOrderObject
  userIdsToExclude?: number[]
  userIdsToInclude?: number[]
}
