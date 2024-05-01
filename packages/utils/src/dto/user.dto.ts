import {
  IsEmail,
  IsUUID,
  IsString,
  IsUrl,
  IsBoolean,
  IsDate,
  IsOptional,
  IsNotEmpty,
  IsObject,
} from "class-validator";

export class UserEmailDto {
  @IsEmail()
  email = "";
}

export class UserIdDto {
  @IsUUID()
  id = "";
}

export class UserLoginDto {
  @IsEmail()
  email = "";
  @IsUrl()
  url = "";
}

export class UserInvitedToOrgDto {
  @IsString()
  inviteeUserId = "";
  @IsString()
  orgId = "";
  @IsString()
  role = "";
  @IsString()
  invitedAt = "";
  @IsString()
  invitedByUserId = "";
  @IsString()
  invitedByName = "";
}

export class UserDto {
  @IsUUID()
  id: string;
  @IsEmail()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  avatar: string;
  @IsDate()
  lastLoginAt: Date;
  @IsBoolean()
  disabled = false;
  @IsDate()
  revocationTimestamp: Date;

  constructor(data: UserDto) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.avatar = data.avatar;
    this.lastLoginAt = data.lastLoginAt;
    this.disabled = data.disabled;
    this.revocationTimestamp = data.revocationTimestamp;
  }
}

export class GetUserDto {
  @IsString()
  userId: string;

  @IsEmail()
  email: string;

  constructor(data: GetUserDto) {
    this.userId = data.userId;
    this.email = data.email;
  }
}

export class UserUpdatesDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  disabled?: boolean;

  constructor(data: UserUpdatesDto) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.avatar = data.avatar;
    this.disabled = data.disabled;
  }
}

export class UpdateUserDto {
  @IsString()
  userId: string;

  @IsObject()
  userUpdates: UserUpdatesDto;

  constructor(data: UpdateUserDto) {
    this.userId = data.userId;
    this.userUpdates = data.userUpdates;
  }
}
