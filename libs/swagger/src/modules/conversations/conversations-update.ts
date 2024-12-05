import { applyDecorators } from '@nestjs/common'
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger'

import { SwaggerForbidden403, SwaggerNotFound404 } from '../../responses'
import { SWAGGER_SCHEMAS } from '../../schemas'

export default function () {
  return applyDecorators(
    ApiOkResponse(SWAGGER_SCHEMAS.getConversationResponse),
    ApiBadRequestResponse(SWAGGER_SCHEMAS.updateConversationValidationException),
    SwaggerForbidden403(),
    SwaggerNotFound404()
  )
}
