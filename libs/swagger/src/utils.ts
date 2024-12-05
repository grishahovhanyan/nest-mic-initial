import { applyDecorators, INestApplication } from '@nestjs/common'
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { ApiTags, SwaggerModule } from '@nestjs/swagger'

import { SwaggerUnauthorized401 } from './responses'
import { getSwaggerConfigs, getSwaggerOptions } from './config'

export const registerSwaggerModule = (app: INestApplication<any>, title: string, env: string) => {
  if (env !== 'production') {
    const swaggerDocument = SwaggerModule.createDocument(app, getSwaggerConfigs(`Chat - ${title}`))
    SwaggerModule.setup('swagger-ui', app, swaggerDocument, getSwaggerOptions(`Chat - ${title}`))
  }
}

export const SWAGGER_TAGS = {
  App: 'App',
  Auth: 'Auth',
  Users: 'Users',
  Conversations: 'Conversations',
  Participants: 'Participants',
  Messages: 'Messages'
}

export function SwaggerTag(tag: string) {
  return applyDecorators(ApiTags(tag))
}

export function SwaggerBearerAuth() {
  return applyDecorators(ApiBearerAuth())
}

export function SwaggerPrivateRoute(tagName: string) {
  return applyDecorators(SwaggerTag(tagName), SwaggerBearerAuth(), SwaggerUnauthorized401())
}

export function SwaggerQueryParam(
  name: string,
  isRequired?: boolean,
  description?: string,
  enumValues?: number[] | string[]
) {
  return applyDecorators(ApiQuery({ name, required: isRequired ?? false, description, enum: enumValues }))
}
