import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { DbTables } from '../db.enum'

import { PasswordTransformer } from '@app/common'

@Entity(DbTables.users)
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  fullName: string

  @Column({ nullable: false })
  email: string

  @Column({
    transformer: new PasswordTransformer(),
    nullable: false
  })
  password: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  signedUpAt: Date

  // TODO
  // lastSignedInAt
  // status: online, offline

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...self } = this
    return self
  }
}
