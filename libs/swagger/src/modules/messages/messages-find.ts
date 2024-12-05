import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

import { SwaggerNotFound404 } from '../../responses'
import { SWAGGER_SCHEMAS } from '../../schemas'

export default function () {
  return applyDecorators(ApiOkResponse(SWAGGER_SCHEMAS.getMessageResponse), SwaggerNotFound404())
}
