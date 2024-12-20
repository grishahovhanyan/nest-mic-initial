import { Body, HttpCode, Post, UseGuards } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Transactional } from 'typeorm-transactional'

import { EnhancedController, BadRequestException, ERROR_MESSAGES } from '@app/common'
import { Swagger } from '@app/swagger'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

import { SigninDto, SignupDto } from './dto/auth.dto'
import { AuthService } from './auth.service'
import { UsersService } from './users/users.service'

// TODO; add response dtos for all responses, add transform request

@EnhancedController('auth', false)
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Swagger({
    400: true
  })
  @Post('signup')
  @HttpCode(200)
  @Transactional()
  async signup(@Body() signupUserDto: SignupDto) {
    const user = await this.usersService.getByEmail(signupUserDto.email)

    if (user) {
      throw new BadRequestException(ERROR_MESSAGES.userAlreadyExists)
    }

    const createdUser = await this.usersService.create(signupUserDto)

    return createdUser
  }

  @Swagger({
    400: true
  })
  @Post('signin')
  @HttpCode(200)
  async signin(@Body() signinDto: SigninDto) {
    const user = await this.authService.validateUser(signinDto.email, signinDto.password)

    return {
      accessToken: this.authService.getAccessToken({ userId: user.id })
    }
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  authenticate(@Payload() payload: any) {
    return payload.user
  }
}
