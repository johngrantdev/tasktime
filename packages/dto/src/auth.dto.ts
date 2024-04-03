import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class EncryptedTokenDto {
  @IsString()
  token = "";
}

export class PasswordlessLoginDto {
  @IsEmail()
  email = "";
}

export class TokenPayloadDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsEmail()
  email: string;

  @IsDate()
  iat: Date;

  @IsDate()
  exp: Date;

  constructor(data: { id?: string; email: string; iat: number; exp: number }) {
    if (data.id) {
      this.id = data.id;
    }
    this.email = data.email;
    this.iat = new Date(data.iat * 1000);
    this.exp = new Date(data.exp * 1000);
  }
}

export class LoginResposneDto {
  @IsBoolean()
  sent = false;
}

export class RevokeTokenDto {
  @IsUUID()
  userId: string;

  constructor(data: RevokeTokenDto) {
    this.userId = data.userId;
  }
}
