export const JWT_CONSTANTS = {
  JWT_SECRET: process.env.JWT_SECRET || 'strong_secret_key',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d'
}
