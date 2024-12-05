import { applyDecorators } from '@nestjs/common'
import { ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger'

import { SWAGGER_SCHEMAS } from '../../schemas'

export default function () {
  return applyDecorators(
    ApiCreatedResponse(SWAGGER_SCHEMAS.getParticipantResponse),
    ApiBadRequestResponse(SWAGGER_SCHEMAS.createParticipantValidationException)
  )
}
