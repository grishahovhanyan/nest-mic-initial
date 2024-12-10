/* eslint-disable @typescript-eslint/ban-types */
import { Observable } from 'rxjs'
import { GrpcMethod } from '@nestjs/microservices'
import { Participant } from '@app/database'

interface FindAllParticipantsDto {
  conversationId: number
}

interface FindOneParticipantDto {
  participantId: number
}

interface CreateParticipantDto {
  userId: number
  conversationId: number
}

export interface ParticipantsGrpcServiceClient {
  findAllParticipants(request: FindAllParticipantsDto): Observable<{ results: Participant[] }>
  findOneParticipant(request: FindOneParticipantDto): Observable<Participant>
  createParticipants(request: {
    createParticipantsInput: CreateParticipantDto[]
  }): Observable<{ results: Participant[] }>
}

export const PARTICIPANTS_SERVICE_NAME = 'ParticipantsService'

export function ParticipantsGrpcServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['findAllParticipants', 'findOneParticipant', 'createParticipants']
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcMethod('PARTICIPANTS_SERVICE_NAME', method)(constructor.prototype[method], method, descriptor)
    }
  }
}
