import { applyDecorators } from '@nestjs/common'
import { ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger'

import { SWAGGER_SCHEMAS } from '../../schemas'

export default function () {
  return applyDecorators(
    ApiCreatedResponse(SWAGGER_SCHEMAS.getConversationResponse),
    ApiBadRequestResponse(SWAGGER_SCHEMAS.createConversationValidationException)
  )
}
