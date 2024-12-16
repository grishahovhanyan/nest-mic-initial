import { IntersectionType } from '@nestjs/swagger'
import { IOrderObject } from '@app/database'
import { PaginationDto, SearchDto, getOrderingDescription, USERS_SORT_FIELDS } from '@app/common'
import { StringFieldOptional } from '@app/common/validators'

export class GetUsersDto extends IntersectionType(PaginationDto, SearchDto) {
  @StringFieldOptional({ description: getOrderingDescription(USERS_SORT_FIELDS) }) // TODO: handle this // avoid using  getOrderingDescription
  ordering?: string

  order?: IOrderObject
  userIdsToExclude?: number[]
  userIdsToInclude?: number[]
}
