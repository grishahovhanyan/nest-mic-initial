import messagesIndex from './messages-index'
import messagesCreate from './messages-create'
import messagesFind from './messages-find'
import messagesUpdate from './messages-update'
import messagesDelete from './messages-delete'

export const SwaggerMessages = {
  index: messagesIndex,
  create: messagesCreate,
  find: messagesFind,
  update: messagesUpdate,
  delete: messagesDelete
}
