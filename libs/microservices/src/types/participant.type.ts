import { Participant } from '@app/database'
import { Observable } from 'rxjs'

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

export interface GrpcParticipantsService {
  findAllParticipants(request: FindAllParticipantsDto): Observable<{ results: Participant[] }>
  findOneParticipant(request: FindOneParticipantDto): Observable<Participant>
  createParticipants(request: {
    createParticipantsInput: CreateParticipantDto[]
  }): Observable<{ results: Participant[] }>
}
