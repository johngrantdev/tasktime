import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MagicLoginGuard implements CanActivate {
  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.query.token;

    if (!token) {
      throw new UnauthorizedException('Login token missing');
    }

    try {
      // Ask the authentication service to verify the magic login token
      const isValid = await firstValueFrom(
        this.client.send<boolean>('auth.verifyLoginToken', token),
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid magic login token');
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('Error verifying magic login token');
    }
  }
}
