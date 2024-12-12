import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ClientsModule } from '@nestjs/microservices'
import * as Joi from 'joi'

import { AppConfigModule, JwtAuthGuard, RequestLoggerInterceptor } from '@app/common'
import { getAuthServiceOptions, getParticipantsPackageOptions, getUsersPackageOptions } from '@app/microservices'
import { MysqlModule, Conversation } from '@app/database'

import { ConversationsController } from './conversations.controller'
import { ConversationsGrpcController } from './conversations.grpc.controller'
import { ConversationsService } from './conversations.service'
import { ConversationsRepository } from './conversations.repository'

@Module({
  imports: [
    AppConfigModule({
      // TODO: fix this for all microservices
      CONVERSATIONS_PORT: Joi.number().required(),
      AUTH_TCP_HOST: Joi.string().required(),
      AUTH_TCP_PORT: Joi.number().required()
    }),
    MysqlModule,
    TypeOrmModule.forFeature([Conversation]),
    ClientsModule.registerAsync([getAuthServiceOptions(), getParticipantsPackageOptions(), getUsersPackageOptions()])
  ],
  controllers: [ConversationsController, ConversationsGrpcController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor
    },
    ConversationsService,
    ConversationsRepository
  ],
  exports: [ConversationsService]
})
export class ConversationsModule {}
