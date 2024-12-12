import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ClientsModule } from '@nestjs/microservices'
import * as Joi from 'joi'

import { AppConfigModule, JwtAuthGuard, RequestLoggerInterceptor } from '@app/common'
import { getAuthServiceOptions, getConversationsPackageOptions } from '@app/microservices'
import { MysqlModule, Message } from '@app/database'

import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { MessagesRepository } from './messages.repository'

@Module({
  imports: [
    AppConfigModule({
      MESSAGES_PORT: Joi.number().required(),
      AUTH_TCP_HOST: Joi.string().required(),
      AUTH_TCP_PORT: Joi.number().required()
    }),
    MysqlModule,
    TypeOrmModule.forFeature([Message]),
    ClientsModule.registerAsync([getAuthServiceOptions(), getConversationsPackageOptions()])
  ],
  controllers: [MessagesController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor
    },
    MessagesService,
    MessagesRepository
  ],
  exports: [MessagesService]
})
export class MessagesModule {}
