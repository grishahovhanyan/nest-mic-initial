import { applyDecorators } from '@nestjs/common'
import { ApiBadRequestResponse } from '@nestjs/swagger'
import { SwaggerSuccess200 } from '../../responses'
import { SWAGGER_SCHEMAS } from '../../schemas'

export default function () {
  return applyDecorators(SwaggerSuccess200(), ApiBadRequestResponse(SWAGGER_SCHEMAS.signupValidationException))
}
