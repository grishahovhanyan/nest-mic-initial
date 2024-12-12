import { initializeTransactionalContext } from 'typeorm-transactional'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { join } from 'path'

import { ValidationPipe } from '@app/common'
import { CONVERSATIONS_PACKAGE, getGrpcConnectionOptions } from '@app/microservices'
import { registerSwaggerModule } from '@app/swagger'
import { ConversationsModule } from './conversations.module'

const logger = new Logger('ConversationsMicroservice')

async function bootstrap() {
  initializeTransactionalContext()

  const app = await NestFactory.create(ConversationsModule)
  const configService = app.get(ConfigService)

  // Connect `Conversations` gRPC microservice
  const conversationsGrpcHost = configService.get('CONVERSATIONS_GRPC_HOST')
  const conversationsGrpcPort = configService.get('CONVERSATIONS_GRPC_PORT')
  app.connectMicroservice(
    getGrpcConnectionOptions(
      `${conversationsGrpcHost}:${conversationsGrpcPort}`,
      join(__dirname, '../conversations.proto'),
      CONVERSATIONS_PACKAGE
    )
  )
  logger.log(`📦 Conversations microservice successfully connected: [Transport: gRPC, Port: ${conversationsGrpcPort}]`)

  // Register a global validation pipe to validate incoming requests
  app.useGlobalPipes(new ValidationPipe())

  // Set a global prefix for all routes in the API
  app.setGlobalPrefix('api/v1')

  // Setup Swagger
  registerSwaggerModule(app, 'Conversations', configService.get('NODE_ENV'))

  // Start all Microservices
  await app.startAllMicroservices()

  // Start application
  const port = configService.get('CONVERSATIONS_PORT')
  await app.listen(port, () => logger.log(`🚀 Application is running: [Microservice: 'Conversations', Port: ${port}]`))
}
bootstrap()

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaught exception detected')
  throw err
})
