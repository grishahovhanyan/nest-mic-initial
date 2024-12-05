import { ApiPropertyOptional } from '@nestjs/swagger'
import { getOrderingDescription } from '@app/swagger'
import { MESSAGE_SORT_FIELDS } from '@app/common'
import { IOrderObject } from '@app/database'

export class GetMessagesDto {
  @ApiPropertyOptional()
  page?: number

  @ApiPropertyOptional()
  perPage?: number

  @ApiPropertyOptional({ description: getOrderingDescription(MESSAGE_SORT_FIELDS) })
  ordering?: string

  @ApiPropertyOptional({ description: 'Text for searching' })
  searchText?: string

  order?: IOrderObject
}

export class CreateMessageDto {
  @ApiPropertyOptional({ example: 'Message body' })
  body?: string

  participantId: number
  conversationId: number
}

// TODO: extends from CreateMessageDto
export class UpdateMessageDto {
  @ApiPropertyOptional({ example: 'Message body' })
  body?: string

  participantId: number
  conversationId: number
}
