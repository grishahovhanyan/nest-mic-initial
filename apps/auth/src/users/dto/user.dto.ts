import { IntersectionType } from '@nestjs/swagger'
import { PaginationDto, SearchDto, OrderDto, PageTypes } from '@app/common'

export class GetUsersDto extends IntersectionType(PaginationDto(PageTypes.users), SearchDto, OrderDto()) {
  userIdsToExclude?: number[]
  userIdsToInclude?: number[]
}
