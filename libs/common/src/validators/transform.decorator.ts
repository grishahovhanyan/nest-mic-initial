import { Transform } from 'class-transformer'
import { castArray, isNil, map, trim } from 'lodash'

// MOVE:
/**
 * @description trim spaces from start and end, replace multiple spaces with one.
 * @example
 * @ApiProperty()
 * @IsString()
 * @Trim()
 * name: string;
 * @returns PropertyDecorator
 * @constructor
 */
export function Trim(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return trim(value).replaceAll(/\s\s+/g, ' ')
    } else if (Array.isArray(value)) {
      return map(value, (v) => (typeof v === 'string' ? trim(v).replaceAll(/\s\s+/g, ' ') : v))
    }

    return value
  })
}

export function ToBoolean(): PropertyDecorator {
  return Transform(
    (params) => {
      switch (params.value) {
        case 'true': {
          return true
        }

        case 'false': {
          return false
        }

        default: {
          return params.value
        }
      }
    },
    { toClassOnly: true }
  )
}

/**
 * @description convert string to integer
 * @example
 * @IsNumber()
 * @ToInt()
 * name: number;
 * @returns PropertyDecorator
 * @constructor
 */
export function ToInt(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (typeof value === 'string') {
        return Number.parseInt(value, 10)
      }

      return value
    },
    { toClassOnly: true }
  )
}

/**
 * @description transforms to array, specially for query params
 * @example
 * @IsNumber()
 * @ToArray()
 * name: number;
 * @constructor
 */
export function ToArray(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as unknown

      if (isNil(value)) {
        return []
      }

      return castArray(value)
    },
    { toClassOnly: true }
  )
}

export function ToLowerCase(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (typeof value === 'string') {
        return value.toLowerCase()
      } else if (Array.isArray(value)) {
        return value.map((v) => (typeof v === 'string' ? v.toLowerCase() : v))
      }

      return value
    },
    { toClassOnly: true }
  )
}

export function ToUpperCase(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (typeof value === 'string') {
        return value.toUpperCase()
      } else if (Array.isArray(value)) {
        return value.map((v) => (typeof v === 'string' ? v.toUpperCase() : v))
      }

      return value
    },
    { toClassOnly: true }
  )
}

export function ToNullStringNull(): PropertyDecorator {
  return Transform(({ value }) => (value === 'null' ? null : value), { toClassOnly: true })
}
