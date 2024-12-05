import conversationsIndex from './conversations-index'
import conversationsCreate from './conversations-create'
import conversationsFind from './conversations-find'
import conversationsUpdate from './conversations-update'
import conversationsDelete from './conversations-delete'

export const SwaggerConversations = {
  index: conversationsIndex,
  create: conversationsCreate,
  find: conversationsFind,
  update: conversationsUpdate,
  delete: conversationsDelete
}
