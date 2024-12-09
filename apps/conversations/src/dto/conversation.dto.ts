import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { getOrderingDescription, CONVERSATIONS_SORT_FIELDS } from '@app/common'
import { IOrderObject } from '@app/database'

export class GetConversationsDto {
  @ApiPropertyOptional()
  page?: number

  @ApiPropertyOptional()
  perPage?: number

  @ApiPropertyOptional({ description: getOrderingDescription(CONVERSATIONS_SORT_FIELDS) })
  ordering?: string

  @ApiPropertyOptional({ description: 'Text for searching' })
  searchText?: string

  userId: number
  order?: IOrderObject
}

export class CreateConversationDto {
  @ApiProperty({ example: 'Conversation Name' })
  name: string

  @ApiProperty({ example: [1, 2, 3] })
  userIds: number[]

  creatorId: number
}

export class UpdateConversationDto {
  @ApiPropertyOptional({ example: 'Conversation Name' })
  name: string
}
