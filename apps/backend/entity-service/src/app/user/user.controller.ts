import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  GetUserDto,
  RevokeTokenDto,
  UserDto,
  UserEmailDto,
  UserIdDto,
  UpdateUserDto,
} from 'tasktime-utils';
import { SkipAuth } from '../shared/decorators/skipAuth.decorator';

// This endpoint is used for own user profile
// Other users can be accessed through the 'org/:orgId/members/' endpoint
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.getOrCreateUserByEmail')
  @SkipAuth()
  async getOrCreateUserByEmail(
    @Payload() data: UserEmailDto,
  ): Promise<UserIdDto> {
    return this.userService.getOrCreateUserByEmail(data.email);
  }

  @MessagePattern('user.getUser')
  async getUser(@Payload() data: GetUserDto): Promise<UserDto> {
    return this.userService.getUser(data.userId);
  }

  @MessagePattern('user.update')
  async updateUser(@Payload() data: UpdateUserDto): Promise<UserDto> {
    return this.userService.updateUser(data.userId, data.userUpdates);
  }

  @MessagePattern('user.revokeAllTokenValidity')
  handleRevokeAllTokenValidity(@Payload() payload: RevokeTokenDto) {
    this.userService.handleRevokeAllTokenValidity(payload.userId);
  }
}
