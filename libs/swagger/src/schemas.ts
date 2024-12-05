import { VALIDATION_MESSAGES, ERROR_MESSAGES } from '@app/common'
import {
  paginatedResponseProperties,
  conversationProperties,
  participantProperties,
  messageProperties
} from './schema-properties'

const BAD_REQUEST_DESCRIPTION = 'Bad Request'

const arrayProperty = (key: string, example: string[]) => ({
  [key]: {
    type: 'array',
    items: { type: 'string' },
    example
  }
})

export const SWAGGER_SCHEMAS = {
  // ******* Exceptions *******
  signupValidationException: {
    description: BAD_REQUEST_DESCRIPTION,
    schema: {
      properties: {
        ...arrayProperty('fullName', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('email', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('password', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('confirmPassword', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('nonFieldErrors', [ERROR_MESSAGES.userAlreadyExists])
      }
    }
  },
  signinValidationException: {
    description: BAD_REQUEST_DESCRIPTION,
    schema: {
      properties: {
        ...arrayProperty('email', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('password', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('nonFieldErrors', [VALIDATION_MESSAGES.invalidEmailPassword])
      }
    }
  },
  createConversationValidationException: {
    // TODO
    description: BAD_REQUEST_DESCRIPTION,
    schema: {
      properties: {
        ...arrayProperty('name', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('category', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('price', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidNumber]),
        ...arrayProperty('description', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString])
      }
    }
  },
  updateConversationValidationException: {
    // TODO
    description: BAD_REQUEST_DESCRIPTION,
    schema: {
      properties: {
        ...arrayProperty('name', [VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('category', [VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('price', [VALIDATION_MESSAGES.invalidNumber]),
        ...arrayProperty('description', [VALIDATION_MESSAGES.invalidString])
      }
    }
  },
  createParticipantValidationException: {
    // TODO
    description: BAD_REQUEST_DESCRIPTION,
    schema: {
      properties: {
        ...arrayProperty('name', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('category', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('price', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidNumber]),
        ...arrayProperty('description', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString])
      }
    }
  },
  updateParticipantValidationException: {
    // TODO
    description: BAD_REQUEST_DESCRIPTION,
    schema: {
      properties: {
        ...arrayProperty('name', [VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('category', [VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('price', [VALIDATION_MESSAGES.invalidNumber]),
        ...arrayProperty('description', [VALIDATION_MESSAGES.invalidString])
      }
    }
  },
  createMessageValidationException: {
    // TODO
    description: BAD_REQUEST_DESCRIPTION,
    schema: {
      properties: {
        ...arrayProperty('name', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('category', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('price', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidNumber]),
        ...arrayProperty('description', [VALIDATION_MESSAGES.required, VALIDATION_MESSAGES.invalidString])
      }
    }
  },
  updateMessageValidationException: {
    // TODO
    description: BAD_REQUEST_DESCRIPTION,
    schema: {
      properties: {
        ...arrayProperty('name', [VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('category', [VALIDATION_MESSAGES.invalidString]),
        ...arrayProperty('price', [VALIDATION_MESSAGES.invalidNumber]),
        ...arrayProperty('description', [VALIDATION_MESSAGES.invalidString])
      }
    }
  },
  // **************************
  signinResponse: { schema: { properties: { accessToken: { type: 'string' } } } },
  paginatedResponse: (itemProperties) => ({
    schema: { properties: paginatedResponseProperties(itemProperties) }
  }),
  getConversationResponse: { schema: { properties: conversationProperties } },
  getParticipantResponse: { schema: { properties: participantProperties } },
  getMessageResponse: { schema: { properties: messageProperties } }
}
