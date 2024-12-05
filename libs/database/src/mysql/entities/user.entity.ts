import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { DB_TABLES } from '../constants'

// TODO: test, use ../../ instead
import { PasswordTransformer } from '../../../../common/src/transformers/password.transformer'

@Entity(DB_TABLES.users)
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
