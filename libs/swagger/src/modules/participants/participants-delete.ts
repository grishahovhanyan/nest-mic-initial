import { applyDecorators } from '@nestjs/common'

import { SwaggerForbidden403, SwaggerNotFound404, SwaggerSuccess200 } from '../../responses'

export default function () {
  return applyDecorators(SwaggerSuccess200(), SwaggerForbidden403(), SwaggerNotFound404())
}
