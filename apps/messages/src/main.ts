import { initializeTransactionalContext } from 'typeorm-transactional'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { Logger, ValidationPipe } from '@nestjs/common'

// import { ValidationPipe } from '@app/common'
import { registerSwaggerModule } from '@app/swagger'
import { MessagesModule } from './messages.module'

const logger = new Logger('MessagesMicroservice')

async function bootstrap() {
  initializeTransactionalContext()

  const app = await NestFactory.create(MessagesModule)
  const configService = app.get(ConfigService)

  // Register a global validation pipe to validate incoming requests
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } })
  )

  // Set a global prefix for all routes in the API
  app.setGlobalPrefix('api/v1')

  // Setup Swagger
  registerSwaggerModule(app, 'Messages', configService.get('NODE_ENV'))

  // Start application
  const port = configService.get('MESSAGES_PORT')
  await app.listen(port, () => logger.log(`🚀 Application is running: [Microservice: 'Messages', Port: ${port}]`))
}
bootstrap()

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaught exception detected')
  throw err
})
