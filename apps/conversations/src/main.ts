import { initializeTransactionalContext } from 'typeorm-transactional'
import { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { join } from 'path'

import { appUtilsService, envService } from '@app/common'
import { CONVERSATIONS_PACKAGE, getGrpcConnectionOptions } from '@app/microservices'
import { ConversationsModule } from './conversations.module'

const logger = new Logger('ConversationsMicroservice')

async function bootstrap() {
  initializeTransactionalContext()

  const app = await NestFactory.create<NestExpressApplication>(ConversationsModule)
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

  // Setup application
  appUtilsService.setupApp(app, { swaggerTitle: 'Conversations' })

  // Start all Microservices
  await app.startAllMicroservices()

  // Start application
  const port = envService.getEnvNumber('CONVERSATIONS_PORT')
  await app.listen(port, () => logger.log(`🚀 Application is running: [Microservice: 'Conversations', Port: ${port}]`))
}
bootstrap()

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaught exception detected')
  throw err
})
