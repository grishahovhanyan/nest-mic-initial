import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

import { BaseRepository } from '@app/common'
import { Participant } from '@app/database'

@Injectable()
export class ParticipantsRepository extends BaseRepository<Participant> {
  constructor(dataSource: DataSource) {
    super(dataSource, Participant)
  }
}
