import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

import { BaseRepository } from '@app/common'
import { Message } from '@app/database'

@Injectable()
export class MessagesRepository extends BaseRepository<Message> {
  constructor(dataSource: DataSource) {
    super(dataSource, Message)
  }
}
