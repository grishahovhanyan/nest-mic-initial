import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

import { participantProperties } from '../../schema-properties'
import { SWAGGER_SCHEMAS } from '../../schemas'

export default function () {
  return applyDecorators(ApiOkResponse(SWAGGER_SCHEMAS.paginatedResponse(participantProperties)))
}
