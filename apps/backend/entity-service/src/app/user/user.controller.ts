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

  // The gateway fills userId from the verified JWT, so these only ever
  // reach the caller's own row.
  @MessagePattern('user.getUser')
  @SkipAuth()
  async getUser(@Payload() data: GetUserDto): Promise<UserDto> {
    return this.userService.getUser(data.userId);
  }

  @MessagePattern('user.update')
  @SkipAuth()
  async updateUser(@Payload() data: UpdateUserDto): Promise<UserDto> {
    return this.userService.updateUser(data.userId, data.userUpdates);
  }

  @MessagePattern('user.revokeAllTokenValidity')
  @SkipAuth()
  handleRevokeAllTokenValidity(@Payload() payload: RevokeTokenDto) {
    this.userService.handleRevokeAllTokenValidity(payload.userId);
  }
}
