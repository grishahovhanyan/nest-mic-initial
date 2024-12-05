import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Transactional } from 'typeorm-transactional'

import { Public, BadRequestException, ERROR_MESSAGES } from '@app/common'
import { SWAGGER_TAGS, SwaggerTag, SwaggerAuth } from '@app/swagger'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

import { SigninDto, SignupDto } from './dto/auth.dto'
import { AuthService } from './auth.service'
import { UsersService } from './users/users.service'

@SwaggerTag(SWAGGER_TAGS.Auth)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @SwaggerAuth.signup()
  @Public()
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

  @SwaggerAuth.signin()
  @Public()
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
