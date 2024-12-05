import { applyDecorators } from '@nestjs/common'
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger'
import { SWAGGER_SCHEMAS } from '../../schemas'

export default function () {
  return applyDecorators(
    ApiOkResponse(SWAGGER_SCHEMAS.signinResponse),
    ApiBadRequestResponse(SWAGGER_SCHEMAS.signinValidationException)
  )
}
