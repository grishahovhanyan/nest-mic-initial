import { IntersectionType } from '@nestjs/swagger'
import { IOrderObject } from '@app/database'
import { PaginationDto, SearchDto, getOrderingDescription } from '@app/common'
import { BooleanFieldOptional, NumberIdsField, StringField, StringFieldOptional } from '@app/common/validators'

export class GetConversationsDto extends IntersectionType(PaginationDto, SearchDto) {
  @StringFieldOptional({ description: getOrderingDescription() })
  ordering?: string

  @BooleanFieldOptional()
  groupOnly?: boolean

  @BooleanFieldOptional()
  p2pOnly?: boolean

  order?: IOrderObject
  userId: number
}

export class CreateConversationDto {
  @StringField({ example: 'Conversation Name' })
  name: string

  @NumberIdsField()
  userIds: number[]

  creatorId: number
}

export class UpdateConversationDto {
  @StringFieldOptional({ example: 'Conversation Name' })
  name?: string
}
