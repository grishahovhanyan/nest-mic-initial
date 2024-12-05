import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'
import { Match } from '@app/common'
import { VALIDATION_MESSAGES, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@app/common'

export class SignupDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty({ example: 'password' })
  @MaxLength(PASSWORD_MAX_LENGTH, { message: VALIDATION_MESSAGES.lengthMustBeLessThan(PASSWORD_MAX_LENGTH) })
  @MinLength(PASSWORD_MIN_LENGTH, { message: VALIDATION_MESSAGES.lengthMustBeGreaterThan(PASSWORD_MIN_LENGTH) })
  @IsString()
  password: string

  @ApiProperty({ example: 'password' })
  @IsString()
  @Match('password', { message: VALIDATION_MESSAGES.passwordMismatch })
  confirmPassword: string
}

export class SigninDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty({ example: 'password' })
  @IsString()
  password: string
}
