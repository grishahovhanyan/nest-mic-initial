import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { DB_TABLES } from '../constants'

import { Conversation } from './conversation.entity'
import { User } from './user.entity'

@Entity(DB_TABLES.participants)
export class Participant {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  userId: number

  @Column({ nullable: false })
  conversationId: number

  @Column({ nullable: false, default: false })
  isAdmin: boolean

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Conversation, (conversation) => conversation.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation
}
