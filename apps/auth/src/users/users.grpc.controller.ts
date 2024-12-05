import { GrpcMethod } from '@nestjs/microservices'
import { Controller } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller()
// TODO: UsersGrpcService OR UsersService
export class UsersGrpcController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'FindUsersByIds')
  async findUsersByIds(findUsersByIdsDto: { userIds: number[] }) {
    const users = await this.usersService.getByIds(findUsersByIdsDto.userIds)
    return { results: users }
  }

  @GrpcMethod('UsersService', 'FindOneUser')
  async findOneUser(findOneUserDto: { userId: number }) {
    return await this.usersService.getById(findOneUserDto.userId)
  }
}
