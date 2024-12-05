import { ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { catchError, map, of, tap } from 'rxjs'

import { IS_PUBLIC_KEY, UnauthorizedException } from '@app/common'
import { AUTH_SERVICE } from '@app/microservices'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(AUTH_SERVICE) private readonly authService: ClientProxy, private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    // TODO: 401 instead of 403
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    const jwt = context.switchToHttp().getRequest().headers?.authorization?.split(' ').pop()

    return this.authService
      .send('authenticate', {
        authorization: jwt
      })
      .pipe(
        tap((res) => (context.switchToHttp().getRequest().user = res)),
        map(() => true),
        catchError((err) => {
          console.error(err)
          return of(false)
        })
      )
  }

  handleRequest(err: Error, user) {
    if (err || !user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
