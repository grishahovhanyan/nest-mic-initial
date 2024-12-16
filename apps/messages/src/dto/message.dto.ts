import { IOrderObject } from '@app/database'
import { getOrderingDescription, DEFAULT_SORT_FIELDS } from '@app/common'
import { NumberFieldOptional, StringField, StringFieldOptional } from '@app/common/validators'

// TODO: move all regarding pagination  to separate dto in common
export class GetMessagesDto {
  @NumberFieldOptional({ positive: true })
  page?: number

  @NumberFieldOptional({ positive: true })
  perPage?: number

  @StringFieldOptional({ description: getOrderingDescription(DEFAULT_SORT_FIELDS) })
  ordering?: string

  @StringFieldOptional({ description: 'Text for searching' })
  searchText?: string

  order?: IOrderObject
  conversationId: number
}

export class CreateMessageDto {
  @StringField({ example: 'Message body' })
  body: string

  participantId: number
  conversationId: number
}

// TODO: extends from CreateMessageDto see transport project
export class UpdateMessageDto {
  @StringFieldOptional({ example: 'Message body' })
  body?: string

  participantId: number
  conversationId: number
}
