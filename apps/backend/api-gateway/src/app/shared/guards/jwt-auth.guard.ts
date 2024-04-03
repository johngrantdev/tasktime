import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/skipAuth.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetUserDto, TokenPayloadDto, UserDto } from '@tasktime/dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenFromCookie = request.cookies?.jwt;

    // Acknowledge SkipAuth decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!tokenFromCookie) {
      return false;
    }

    try {
      // Expect the 'auth' service to validate the JWT and return the user payload.
      const jwtPayload: TokenPayloadDto = await firstValueFrom(
        this.client.send<TokenPayloadDto>('auth.verifyToken', tokenFromCookie),
      );

      // If the token contains a valid payload
      if (jwtPayload && jwtPayload.id && jwtPayload.email) {
        const getUserRequest: GetUserDto = {
          userId: jwtPayload.id,
          email: jwtPayload.email,
        };
        // get the user to to check
        // - the user is enabled
        // - the token was not issued before the users token revokation timestamp
        const user: UserDto = await firstValueFrom(
          this.client.send('user.getUser', getUserRequest),
        );

        if (
          user &&
          !user.disabled &&
          user.revocationTimestamp < jwtPayload.iat
        ) {
          request.user = jwtPayload;
          return true;
        }
      }
      return false;
    } catch (error) {
      // If there's any error, consider the JWT invalid.
      return false;
    }
  }
}
