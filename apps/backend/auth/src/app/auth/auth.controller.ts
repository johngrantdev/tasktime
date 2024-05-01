import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  TokenPayloadDto,
  EncryptedTokenDto,
  LoginResposneDto,
  PasswordlessLoginDto,
} from '@tasktime/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.loginLinkRequest')
  async handleLoginRequest(
    @Payload() data: PasswordlessLoginDto,
  ): Promise<LoginResposneDto> {
    return await this.authService.handleLoginRequest(data);
  }

  @MessagePattern('auth.loginLinkCallback')
  async handleLoginCallback(
    @Payload() payload: EncryptedTokenDto,
  ): Promise<EncryptedTokenDto> {
    return await this.authService.handleLoginCallback(payload);
  }

  @MessagePattern('auth.verifyToken')
  async handleVerifyToken(
    @Payload() payload: EncryptedTokenDto,
  ): Promise<TokenPayloadDto> {
    return await this.authService.handleVerifyToken(payload);
  }
}
