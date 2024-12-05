import participantsIndex from './participants-index'
import participantsCreate from './participants-create'
import participantsFind from './participants-find'
import participantsUpdate from './participants-update'
import participantsDelete from './participants-delete'

export const SwaggerParticipants = {
  index: participantsIndex,
  create: participantsCreate,
  find: participantsFind,
  update: participantsUpdate,
  delete: participantsDelete
}
