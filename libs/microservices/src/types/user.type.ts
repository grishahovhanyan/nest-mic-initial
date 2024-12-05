import { User } from '@app/database'
import { Observable } from 'rxjs'

interface FindOneUserDto {
  userId: number
}

interface FindUsersByIdsDto {
  userIds: number[]
}

export interface GrpcUsersService {
  findOneUser(request: FindOneUserDto): Observable<User>
  findUsersByIds(request: FindUsersByIdsDto): Observable<{ results: User[] }>
}
