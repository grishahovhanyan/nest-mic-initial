import { IOrderObject } from '@app/database'

export enum SortDirections {
  ascending = 'ASC',
  descending = 'DESC'
}

export const DEFAULT_SORT_FIELDS = ['id']

export const USERS_SORT_FIELDS = ['id', 'fullName']

export function getSortOrderFromQuery(
  queryOrdering: string[],
  allowedSortFields: string[] = DEFAULT_SORT_FIELDS
): IOrderObject {
  const sortOrder = queryOrdering.reduce((orderObject, sortField) => {
    let sortDirection = SortDirections.ascending
    if (sortField.startsWith('-')) {
      sortDirection = SortDirections.descending
      sortField = sortField.slice(1)
    }

    if (allowedSortFields.includes(sortField)) {
      orderObject[sortField] = sortDirection
    }
    return orderObject
  }, {})

  return sortOrder
}

export const getOrderingDescription = (sortFields: string[]) => `
    Allowed fields: ${sortFields.join(', ')}

    Examples: 
      ?ordering=-id (descending) 
      ?ordering=createdAt (ascending) 
      ?ordering=id,-createdAt`
