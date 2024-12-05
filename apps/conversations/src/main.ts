import { initializeTransactionalContext } from 'typeorm-transactional'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'

import { ValidationPipe } from '@app/common'
import { registerSwaggerModule } from '@app/swagger'
import { ConversationsModule } from './conversations.module'

const logger = new Logger('ConversationsMicroservice')

async function bootstrap() {
  initializeTransactionalContext()

  const app = await NestFactory.create(ConversationsModule)
  const configService = app.get(ConfigService)

  // Register a global validation pipe to validate incoming requests
  app.useGlobalPipes(new ValidationPipe())

  // Set a global prefix for all routes in the API
  app.setGlobalPrefix('api/v1')

  // Setup Swagger
  registerSwaggerModule(app, 'Conversations', configService.get('NODE_ENV'))

  // Start application
  const port = configService.get('CONVERSATIONS_PORT')
  await app.listen(port, () => logger.log(`🚀 Application is running: [Microservice: 'Conversations', Port: ${port}]`))
}
bootstrap()

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaught exception detected')
  throw err
})
