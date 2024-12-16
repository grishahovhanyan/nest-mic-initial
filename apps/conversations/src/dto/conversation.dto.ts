import { IOrderObject } from '@app/database'
import { PaginationDto, getOrderingDescription, DEFAULT_SORT_FIELDS } from '@app/common'
import { NumberIdsField, StringField, StringFieldOptional } from '@app/common/validators'

export class GetConversationsDto extends PaginationDto {
  @StringFieldOptional({ description: getOrderingDescription(DEFAULT_SORT_FIELDS) })
  ordering?: string

  @StringFieldOptional({ description: 'Text for searching' })
  searchText?: string

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
