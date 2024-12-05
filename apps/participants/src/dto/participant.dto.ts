import { IOrderObject } from '@app/database'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GetParticipantsDto {
  @ApiPropertyOptional()
  page?: number

  @ApiPropertyOptional()
  perPage?: number

  order?: IOrderObject
}

// TODO: add validation
export class CreateParticipantDto {
  @ApiProperty({ example: 3 })
  userId: number

  conversationId: number
}

export class UpdateParticipantDto {
  @ApiPropertyOptional()
  isAdmin: boolean
}
