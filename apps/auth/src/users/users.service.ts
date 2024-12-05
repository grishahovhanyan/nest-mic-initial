import { Injectable } from '@nestjs/common'
import { In, Like, Not } from 'typeorm'

import { IFindAndCountInput, User } from '@app/database'
import { GetUsersDto, CreateUserDto } from './dto/user.dto'

import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserInput: CreateUserDto): Promise<User> {
    return await this.usersRepository.create(createUserInput)
  }

  async getById(userId: number): Promise<User | null> {
    return await this.usersRepository.findOne({ id: userId })
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ email })
  }

  async getByIds(userIds: number[]): Promise<User[]> {
    return await this.usersRepository.find({ id: In(userIds) })
  }

  async getAndCount(getUsersInput: GetUsersDto) {
    const { page, perPage, order, searchText, userIdsToExclude, userIdsToInclude } = getUsersInput

    const findAndCountInput: IFindAndCountInput<User> = {
      conditions: {
        ...(searchText?.trim() ? { fullName: Like(`%${searchText.trim()}%`) } : {}),
        ...(userIdsToExclude?.length ? { id: Not(In(userIdsToExclude)) } : {}),
        ...(userIdsToInclude?.length ? { id: In(userIdsToExclude) } : {})
      },
      take: perPage,
      skip: (page - 1) * perPage,
      order
    }

    return await this.usersRepository.findAndCount(findAndCountInput)
  }
}
