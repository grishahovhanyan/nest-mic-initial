import { IOrderObject } from '@app/database'
import { getOrderingDescription, DEFAULT_SORT_FIELDS } from '@app/common'
import { NumberFieldOptional, NumberIdsField, StringField, StringFieldOptional } from '@app/common/validators'

export class GetConversationsDto {
  @NumberFieldOptional({ positive: true })
  page?: number

  @NumberFieldOptional({ positive: true })
  perPage?: number

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
