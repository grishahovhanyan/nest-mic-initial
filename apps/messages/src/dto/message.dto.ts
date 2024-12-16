import { IntersectionType, PickType } from '@nestjs/swagger'
import { IOrderObject } from '@app/database'
import { PaginationDto, SearchDto, getOrderingDescription } from '@app/common'
import { StringField, StringFieldOptional } from '@app/common/validators'

export class GetMessagesDto extends IntersectionType(PaginationDto, SearchDto) {
  @StringFieldOptional({ description: getOrderingDescription() })
  ordering?: string

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
