import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { getOrderingDescription, DEFAULT_SORT_FIELDS } from '@app/common'
import { IOrderObject } from '@app/database'

export class GetParticipantsDto {
  @ApiPropertyOptional()
  page?: number

  @ApiPropertyOptional()
  perPage?: number

  @ApiPropertyOptional({ description: getOrderingDescription(DEFAULT_SORT_FIELDS) })
  ordering?: string

  @ApiPropertyOptional({ description: 'Text for searching' })
  searchText?: string

  order?: IOrderObject
  userId: number
  conversationId: number
}

// TODO: add validation
export class CreateParticipantDto {
  @ApiProperty({ example: 3 })
  userId: number

  @ApiPropertyOptional({ example: false })
  isAdmin?: boolean

  conversationId: number
}

export class UpdateParticipantDto {
  @ApiProperty()
  isAdmin: boolean
}
