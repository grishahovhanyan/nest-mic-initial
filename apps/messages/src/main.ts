import { NestExpressApplication } from '@nestjs/platform-express'
import { initializeTransactionalContext } from 'typeorm-transactional'
import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'

import { appUtilsService, envService } from '@app/common'
import { MessagesModule } from './messages.module'

const logger = new Logger('MessagesMicroservice')

async function bootstrap() {
  initializeTransactionalContext()

  const app = await NestFactory.create<NestExpressApplication>(MessagesModule)

  // Setup application
  appUtilsService.setupApp(app, { swaggerTitle: 'Messages' })

  // Start application
  const port = envService.getEnvNumber('MESSAGES_PORT')
  await app.listen(port, () => logger.log(`🚀 Application is running: [Microservice: 'Messages', Port: ${port}]`))
}
bootstrap()

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaught exception detected')
  throw err
})
