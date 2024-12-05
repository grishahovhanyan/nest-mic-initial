export const PAGE_SIZE_TYPES = {
  users: 'users',
  conversations: 'conversations',
  participants: 'participants',
  messages: 'messages'
}

export const PAGE_SIZES = {
  usersPageSize: Number(process.env.USERS_PAGE_SIZE) || 50,
  conversationsPageSize: Number(process.env.CONVERSATIONS_PAGE_SIZE) || 50,
  participantsPageSize: Number(process.env.PARTICIPANTS_PAGE_SIZE) || 50,
  messagesPageSize: Number(process.env.MESSAGES_PAGE_SIZE) || 50
}

export const MAX_PAGE_SIZES = {
  usersMaxPageSize: Number(process.env.USERS_MAX_PAGE_SIZE) || 200,
  conversationsMaxPageSize: Number(process.env.CONVERSATIONS_MAX_PAGE_SIZE) || 200,
  participantsMaxPageSize: Number(process.env.PARTICIPANTS_MAX_PAGE_SIZE) || 200,
  messagesMaxPageSize: Number(process.env.MESSAGES_MAX_PAGE_SIZE) || 200
}

export function getPageSize(type: string, querySize?: number) {
  const maxSize = MAX_PAGE_SIZES[`${type}MaxPageSize`]
  const defaultSize = PAGE_SIZES[`${type}PageSize`]

  return Number(querySize) && Number(querySize) <= maxSize ? Number(querySize) : defaultSize
}

export function getPagesForResponse(totalCount: number, page: number, perPage: number) {
  const numPages = Math.ceil(totalCount / perPage)

  return {
    next: page + 1 > numPages ? null : page + 1,
    previous: page - 1 < 1 ? null : page - 1,
    current: page,
    numPages,
    perPage
  }
}

export function paginatedResponse(totalCount: number, page: number, perPage: number, results) {
  return {
    pages: getPagesForResponse(totalCount, page, perPage),
    count: results.length,
    results
  }
}
