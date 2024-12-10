import { INestApplication } from '@nestjs/common'
import { SwaggerModule } from '@nestjs/swagger'

import { getSwaggerConfigs, getSwaggerOptions } from './config'

export const registerSwaggerModule = (app: INestApplication<any>, title: string, env: string) => {
  if (env !== 'production') {
    const swaggerDocument = SwaggerModule.createDocument(app, getSwaggerConfigs(`Chat - ${title}`))
    SwaggerModule.setup('swagger-ui', app, swaggerDocument, getSwaggerOptions(`Chat - ${title}`))
  }
}
