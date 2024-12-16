import { PickType } from '@nestjs/swagger'
import { IOrderObject } from '@app/database'
import { PaginationDto, getOrderingDescription, DEFAULT_SORT_FIELDS } from '@app/common'
import { BooleanFieldOptional, NumberField, StringFieldOptional } from '@app/common/validators'

export class GetParticipantsDto extends PaginationDto {
  @StringFieldOptional({ description: getOrderingDescription(DEFAULT_SORT_FIELDS) })
  ordering?: string

  @StringFieldOptional({ description: 'Text for searching' })
  searchText?: string

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
