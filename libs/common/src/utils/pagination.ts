import { getSortOrderFromQuery } from '@app/common'
import { IOrderObject } from '@app/database'
import { envService } from './get-env'

export enum PageSizeTypes {
  users = 'users',
  conversations = 'conversations',
  participants = 'participants',
  messages = 'messages'
}

export const DEFAULT_PAGE_SIZES = {
  usersPageSize: envService.getEnvNumber('USERS_PAGE_SIZE', 50),
  conversationsPageSize: envService.getEnvNumber('CONVERSATIONS_PAGE_SIZE', 50),
  participantsPageSize: envService.getEnvNumber('PARTICIPANTS_PAGE_SIZE', 50),
  messagesPageSize: envService.getEnvNumber('MESSAGES_PAGE_SIZE', 50)
}

export const MAX_PAGE_SIZES = {
  usersMaxPageSize: envService.getEnvNumber('USERS_MAX_PAGE_SIZE', 200),
  conversationsMaxPageSize: envService.getEnvNumber('CONVERSATIONS_MAX_PAGE_SIZE', 200),
  participantsMaxPageSize: envService.getEnvNumber('PARTICIPANTS_MAX_PAGE_SIZE', 200),
  messagesMaxPageSize: envService.getEnvNumber('MESSAGES_MAX_PAGE_SIZE', 200)
}

export function getPerPage(type: string, querySize?: number) {
  const maxSize = MAX_PAGE_SIZES[`${type}MaxPageSize`]
  const defaultSize = DEFAULT_PAGE_SIZES[`${type}PageSize`]

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

export function getPaginationAndSortOrder(
  query: { page?: number; perPage?: number; ordering?: string },
  pageSizeType: string,
  allowedSortFields: string[] = []
): { page: number; perPage: number; order: IOrderObject } {
  const page = +query.page || 1
  const perPage = getPerPage(pageSizeType, +query.perPage)
  const order = getSortOrderFromQuery(query.ordering?.split(',') ?? [], allowedSortFields)

  return { page, perPage, order }
}

export function paginatedResponse<T>(items: T[], totalCount: number, page: number, perPage: number) {
  return {
    pages: getPagesForResponse(totalCount, page, perPage),
    count: items.length,
    items
  }
}
