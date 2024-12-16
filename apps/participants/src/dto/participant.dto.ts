import { IntersectionType, PickType } from '@nestjs/swagger'
import { IOrderObject } from '@app/database'
import { PaginationDto, SearchDto, getOrderingDescription } from '@app/common'
import { BooleanFieldOptional, NumberField, StringFieldOptional } from '@app/common/validators'

export class GetParticipantsDto extends IntersectionType(PaginationDto, SearchDto) {
  @StringFieldOptional({ description: getOrderingDescription() })
  ordering?: string

  order?: IOrderObject
  userId: number
  conversationId: number
}

export class CreateParticipantDto {
  @NumberField({ example: 3 })
  userId: number

  @BooleanFieldOptional({ example: false })
  isAdmin?: boolean

  conversationId: number
}

export class UpdateParticipantDto extends PickType(CreateParticipantDto, ['isAdmin', 'conversationId']) {}
