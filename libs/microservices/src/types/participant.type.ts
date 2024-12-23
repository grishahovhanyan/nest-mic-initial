/* eslint-disable @typescript-eslint/ban-types */
import { Observable } from 'rxjs'
import { GrpcMethod } from '@nestjs/microservices'
import { Participant } from '@app/database'

export interface FindOneParticipantDto {
  userId: number
  conversationId: number
}

export interface CreateParticipantDto {
  userId: number
  conversationId: number
}

export interface ParticipantsGrpcServiceClient {
  findOneParticipant(request: FindOneParticipantDto): Observable<Participant>
  createParticipants(request: {
    createParticipantsInput: CreateParticipantDto[]
  }): Observable<{ results: Participant[] }>
}

export const PARTICIPANTS_SERVICE_NAME = 'ParticipantsService'

export function ParticipantsGrpcServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['findOneParticipant', 'createParticipants']
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcMethod(PARTICIPANTS_SERVICE_NAME, method)(constructor.prototype[method], method, descriptor)
    }
  }
}
