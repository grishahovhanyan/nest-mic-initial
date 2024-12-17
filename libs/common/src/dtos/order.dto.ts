import { Transform } from 'class-transformer'
import { StringFieldOptional } from '../validators'
import { getOrderDescription, getSortOrderFromQuery } from '../constants'
import { OrderObject } from '@app/database'

export function OrderDto(sortFields?: string[]) {
  class DynamicOrderDto {
    @Transform(({ value }) => JSON.stringify(getSortOrderFromQuery(value.split(',') ?? [])), { toClassOnly: true })
    @StringFieldOptional({ description: getOrderDescription(sortFields) })
    order?: string | OrderObject
  }

  /*
  ####### NOTE #######
  'order' will be a string in the controller.
  If we want to use the actual 'order' object, we need to use JSON.parse to parse the string into an object.
  */

  return DynamicOrderDto
}
