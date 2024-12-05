import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

import { BaseRepository } from '@app/common'
import { Conversation } from '@app/database'

@Injectable()
export class ConversationsRepository extends BaseRepository<Conversation> {
  constructor(dataSource: DataSource) {
    super(dataSource, Conversation)
  }
}
