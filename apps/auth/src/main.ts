import { initializeTransactionalContext } from 'typeorm-transactional'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { join } from 'path'

import { ValidationPipe } from '@app/common'
import { USERS_PACKAGE, getTcpConnectionOptions, getGrpcConnectionOptions } from '@app/microservices'
import { registerSwaggerModule } from '@app/swagger'
import { AuthModule } from './auth.module'

const logger = new Logger('AuthMicroservice')

async function bootstrap() {
  initializeTransactionalContext()

  const app = await NestFactory.create(AuthModule)
  const configService = app.get(ConfigService)

  // Connect `Auth` TCP microservice
  const tcpHost = configService.get('AUTH_TCP_HOST')
  const tcpPort = configService.get('AUTH_TCP_PORT')
  app.connectMicroservice(getTcpConnectionOptions(tcpHost, tcpPort))
  logger.log(`📦 Auth microservice successfully connected: [Transport: TCP, Port: ${tcpPort}]`)

  // Connect `Users` gRPC microservice
  const usersGrpcHost = configService.get('USERS_GRPC_HOST')
  const usersGrpcPort = configService.get('USERS_GRPC_PORT')
  app.connectMicroservice(
    getGrpcConnectionOptions(`${usersGrpcHost}:${usersGrpcPort}`, join(__dirname, '../users.proto'), USERS_PACKAGE)
  )
  logger.log(`📦 Users microservice successfully connected: [Transport: gRPC, Port: ${usersGrpcPort}]`)

  // Register a global validation pipe to validate incoming requests
  app.useGlobalPipes(new ValidationPipe())

  // Set a global prefix for all routes in the API
  app.setGlobalPrefix('api/v1')

  // Setup Swagger
  registerSwaggerModule(app, 'Auth', configService.get('NODE_ENV'))

  // Start all Microservices
  await app.startAllMicroservices()

  // Start application
  const port = configService.get('AUTH_PORT')
  await app.listen(port, () => logger.log(`🚀 Application is running: [Microservice: 'Auth', Port: ${port}]`))
}
bootstrap()

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaught exception detected')
  throw err
})
