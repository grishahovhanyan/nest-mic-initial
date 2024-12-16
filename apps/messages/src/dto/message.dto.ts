import { PickType } from '@nestjs/swagger'
import { IOrderObject } from '@app/database'
import { PaginationDto, getOrderingDescription, DEFAULT_SORT_FIELDS } from '@app/common'
import { StringField, StringFieldOptional } from '@app/common/validators'

export class GetMessagesDto extends PaginationDto {
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

export class UpdateMessageDto extends PickType(CreateMessageDto, ['participantId', 'conversationId']) {
  @StringFieldOptional({ example: 'Message body' })
  body?: string
}
