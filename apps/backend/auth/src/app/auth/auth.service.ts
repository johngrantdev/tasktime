import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createCipheriv, randomBytes, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';
import {
  PasswordlessLoginDto,
  UserLoginDto,
  EncryptedTokenDto,
  UserIdDto,
  UserEmailDto,
  LoginResposneDto,
  TokenPayloadDto,
} from '@tasktime/utils';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

interface ITokenPayload {
  id?: string;
  email: string;
  iat: number;
  exp: number;
}

interface ICreateLoginTokenPayload {
  email: string;
}

interface ICreateAccessTokenPayload {
  id: string;
  email: string;
}

const USER_SERVICE_UNAVAILABLE_MSG = 'User service is currently unavailable.';
const INVALID_TOKEN = 'Token is invalid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private JWT_ENCRYPTION_KEY: string;

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @Inject('NATS_SERVICE') private readonly natClient: ClientProxy,
  ) {
    if (!process.env.JWT_ENCRYPTION_KEY) {
      throw new Error('JWT_ENCRYPTION_KEY is not defined');
    }
    this.JWT_ENCRYPTION_KEY = process.env.JWT_ENCRYPTION_KEY;
    this.logger.log('Auth Service instantiated');
  }

  async handleLoginRequest(
    data: PasswordlessLoginDto,
  ): Promise<LoginResposneDto> {
    this.logger.log('Subscribed to auth.loginLinkRequest pattern');
    try {
      const { token } = await this.generateLoginToken(data);
      const url = `${this.configService.get<string>(
        'FRONTEND_URL',
      )}/?token=${token}`;
      const payload: UserLoginDto = { email: data.email, url: url };
      const sent = await firstValueFrom(
        this.natClient.send('auth.sendLoginLink', payload),
      );
      return { sent: sent };
    } catch (error) {
      return { sent: false };
    }
  }

  async handleLoginCallback(
    data: EncryptedTokenDto,
  ): Promise<EncryptedTokenDto> {
    try {
      const payload = (await this.extractPayload(data.token)) as ITokenPayload;
      if (!payload || !payload.email) {
        throw new RpcException(INVALID_TOKEN);
      }

      // get existing or new user id
      const response: UserIdDto = await firstValueFrom(
        this.natClient.send('user.getOrCreateUserByEmail', {
          email: payload.email,
        } as UserEmailDto),
      );
      return (await this.generateAccessToken({
        id: response.id,
        email: payload.email,
      })) as EncryptedTokenDto;
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(USER_SERVICE_UNAVAILABLE_MSG);
    }
  }

  async handleVerifyToken(data: EncryptedTokenDto): Promise<TokenPayloadDto> {
    const payload = await this.extractPayload(data.token);
    if (payload && payload.id && payload.email) {
      return new TokenPayloadDto(payload);
    } else {
      throw new RpcException(INVALID_TOKEN);
    }
  }

  async generateLoginToken(
    payload: ICreateLoginTokenPayload,
  ): Promise<EncryptedTokenDto> {
    const jwtToken = this.jwtService.sign(
      { email: payload.email },
      { expiresIn: '5m' },
    );
    const encryptedToken = await this.encrypt(jwtToken);
    return {
      token: encryptedToken.toString('base64'),
    };
  }

  async generateAccessToken(
    user: ICreateAccessTokenPayload,
  ): Promise<EncryptedTokenDto> {
    const jwtToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '1d' },
    );
    const encryptedToken = await this.encrypt(jwtToken);
    return {
      token: encryptedToken.toString('base64'),
    };
  }

  async extractPayload(encryptedJwtToken: string): Promise<ITokenPayload> {
    try {
      const decryptedJwtToken = await this.decrypt(
        Buffer.from(encryptedJwtToken, 'base64'),
      );
      const payload = this.jwtService.verify(decryptedJwtToken);
      if (typeof payload === 'object' && 'email' in payload) {
        return payload;
      } else {
        throw new Error('Invalid token payload');
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new RpcException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new RpcException('Invalid token');
      }
      throw new RpcException('Failed to extract payload from token');
    }
  }

  async encrypt(textToEncrypt: string): Promise<Buffer> {
    const salt = randomBytes(16); // Generate a new salt for each encryption
    const key = (await promisify(scrypt)(
      this.JWT_ENCRYPTION_KEY,
      salt,
      32,
    )) as Buffer; // Generate key using the salt
    const iv = randomBytes(16); // Initialization vector
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedTextBuffer = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    // Prepend salt and IV to the encrypted data
    return Buffer.concat([salt, iv, encryptedTextBuffer]);
  }

  async decrypt(data: Buffer): Promise<string> {
    // Extract salt and IV from the data
    const salt = Uint8Array.prototype.slice.call(data, 0, 16);
    const iv = Uint8Array.prototype.slice.call(data, 16, 32);
    const encryptedTextBuffer = Uint8Array.prototype.slice.call(data, 32);

    const key = (await promisify(scrypt)(
      this.JWT_ENCRYPTION_KEY,
      salt,
      32,
    )) as Buffer; // Generate key using the salt
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    const decryptedTextBuffer = Buffer.concat([
      decipher.update(encryptedTextBuffer),
      decipher.final(),
    ]);

    return decryptedTextBuffer.toString();
  }
}
