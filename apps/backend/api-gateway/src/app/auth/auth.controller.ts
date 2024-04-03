import {
  Controller,
  Res,
  Post,
  Get,
  Body,
  Inject,
  ServiceUnavailableException,
  Query,
  Req,
} from '@nestjs/common';
import { SkipAuth } from '../shared/decorators/skipAuth.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import {
  EncryptedTokenDto,
  LoginResposneDto,
  PasswordlessLoginDto,
} from '@tasktime/dto';
import { firstValueFrom, timeout } from 'rxjs';
import { AuthenticatedRequest } from '../shared/interfaces/authenticatedRequest';
import { Response } from 'express';

const SERVICE_UNAVAILABLE_MSG = 'Auth service is currently unavailable.';

@Controller(`api/auth`)
@ApiTags('auth')
export class AuthController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natClient: ClientProxy,
  ) {}

  // dev only, remove for production
  // endpoint for directly testing microservices
  // @SkipAuth()
  // @Get('test/:address')
  // async test(@Param('address') address: string, @Body() body) {
  //   try {
  //     return await firstValueFrom(this.natClient.send(address, body));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  @SkipAuth()
  @Post('login')
  @ApiOperation({ summary: 'Initiate passwordless login' })
  @ApiResponse({ status: 200, description: 'Sends an login link via email' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Body() body: PasswordlessLoginDto): Promise<LoginResposneDto> {
    try {
      return await firstValueFrom(
        this.natClient
          .send<LoginResposneDto>('auth.loginLinkRequest', body)
          .pipe(timeout(5000)),
      );
    } catch (error) {
      throw new ServiceUnavailableException(SERVICE_UNAVAILABLE_MSG);
    }
  }

  @SkipAuth()
  @Get('login/callback')
  @ApiOperation({ summary: 'Callback for login link' })
  @ApiResponse({
    status: 200,
    description:
      'Return a cookie containing a JTW token for the authenticated user',
  })
  async callback(@Res() res: Response, @Query('token') loginToken: string) {
    try {
      const encryptedAuthToken = await firstValueFrom(
        this.natClient.send('auth.loginLinkCallback', {
          token: loginToken,
        } as EncryptedTokenDto),
      );
      res.cookie('jwt', encryptedAuthToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 hour
        expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hours from now
      });
      res.send({ auth: true });
    } catch (error) {
      res.send(error);
    }
  }

  // this runs if global jwtAuthGuard passes
  @Get('session')
  @ApiOperation({ summary: 'Checks validity of JWT in cookie' })
  @ApiResponse({
    status: 200,
    description: 'Returns the session data from the access JWT.',
  })
  async loginCheck(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    res.send(req.user);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Clears the cookie' })
  @ApiResponse({
    status: 200,
    description: 'Returns loggedOut state',
  })
  logout(@Res() res: Response) {
    res.clearCookie('jwt', { path: '/' });
    return res.send({ loggedOut: true });
  }

  @Post('revoke')
  @ApiOperation({
    summary: 'Revokes validity of all current authentication JWTs',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns loggedOut state',
  })
  revoke(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    this.natClient.emit('auth.revokeAllTokenValidity', req.user.id);
    // res.clearCookie('jwt', { path: '/' });
    // return res.send({ loggedOut: true });
    return res.send({ revoked: true });
  }
}
