import { INestApplication, Logger } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import compression from 'compression'

import { registerSwaggerModule } from '@app/swagger'
import { ValidationPipe } from '@app/common'
import { envService } from './get-env'

// TODO: Create separate logger for each app
class AppUtilsService {
  private readonly logger: Logger = new Logger('App')

  public setupApp(app: NestExpressApplication, options: { apiVersion?: string; swaggerTitle?: string } = {}) {
    const { apiVersion = 'v1', swaggerTitle = 'Swagger' } = options

    // Register a global validation pipe to validate incoming requests
    app.useGlobalPipes(new ValidationPipe())

    // Set a global prefix for all routes in the API
    app.setGlobalPrefix(`api/${apiVersion}`)

    // Enable CORS
    const origins = envService.getOrigins()
    app.enableCors({
      origin: origins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      maxAge: 3600
    })

    this.logger.log(`🚦 Accepting request only from: ${origins}`)

    // Use Helmet to set secure HTTP headers to help protect against well-known vulnerabilities
    app.use(helmet())
    // Trust proxy headers for accurate client IP address detection when behind a reverse proxy
    app.enable('trust proxy')
    // Set strong ETag generation for caching and optimizing responses
    app.set('etag', 'strong')
    // Enable compression to reduce the size of the response bodies and improve loading times
    app.use(compression())

    // Setup Swagger
    this.setupSwagger(app, swaggerTitle)

    // Configure application gracefully shutdown
    app.enableShutdownHooks()
    this.killAppWithGrace(app)
  }

  public async gracefulShutdown(app: INestApplication, code: string): Promise<void> {
    setTimeout(() => process.exit(1), 5000)
    this.logger.verbose(`Signal received with code '${code}'`)

    try {
      await app.close()

      this.logger.log('✅ Http server closed.')
      process.exit(0)
    } catch (error: unknown) {
      this.logger.error(`❌ Http server closed with error: ${error}`)
      process.exit(1)
    }
  }

  public killAppWithGrace(app: INestApplication): void {
    process.on('SIGINT', async () => {
      await this.gracefulShutdown(app, 'SIGINT')
    })

    process.on('SIGTERM', async () => {
      await this.gracefulShutdown(app, 'SIGTERM')
    })
  }

  public setupSwagger(app: INestApplication, swaggerTitle: string) {
    if (!envService.isTestEnv() && !envService.isProductionEnv()) {
      registerSwaggerModule(app, swaggerTitle)
    }
  }
}

export const appUtilsService = new AppUtilsService()
