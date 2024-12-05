import { IDbTables } from '@app/database'

export const DB_TABLES: IDbTables = {
  users: 'users',
  conversations: 'conversations',
  participants: 'participants',
  messages: 'messages'
}

export const DB_RELATIONS = {
  user: 'user'
}
