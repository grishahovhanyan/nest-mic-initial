import { NumberFieldOptional } from '../validators'

// TODO: add default value here ??
export class PaginationDto {
  @NumberFieldOptional({ positive: true })
  page?: number

  @NumberFieldOptional({ positive: true })
  perPage?: number
}
