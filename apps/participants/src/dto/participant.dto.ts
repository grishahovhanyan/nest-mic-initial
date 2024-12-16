import { IOrderObject } from '@app/database'
import { getOrderingDescription, DEFAULT_SORT_FIELDS } from '@app/common'
import {
  BooleanField,
  BooleanFieldOptional,
  NumberField,
  NumberFieldOptional,
  StringFieldOptional
} from '@app/common/validators'

export class GetParticipantsDto {
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
  conversationId: number
}

export class CreateParticipantDto {
  @NumberField({ example: 3 })
  userId: number

  @BooleanFieldOptional({ example: false })
  isAdmin?: boolean

  conversationId: number
}

export class UpdateParticipantDto {
  @BooleanField()
  isAdmin: boolean
}
