import { INestApplication } from '@nestjs/common'
import { SwaggerModule } from '@nestjs/swagger'

import { NodeEnvs } from '@app/common'
import { getSwaggerConfigs, getSwaggerOptions } from './config'

export const registerSwaggerModule = (app: INestApplication<any>, title: string, env: NodeEnvs) => {
  if (![NodeEnvs.production, NodeEnvs.test].includes(env)) {
    const swaggerDocument = SwaggerModule.createDocument(app, getSwaggerConfigs(`Chat - ${title}`))
    SwaggerModule.setup('swagger-ui', app, swaggerDocument, getSwaggerOptions(`Chat - ${title}`))
  }
}
