import { Body, Controller, Get, Inject, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto, UserUpdatesDto } from 'tasktime-utils';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { AuthenticatedRequest } from '../shared/interfaces/authenticatedRequest';

// This endpoint is used for own user profile
// Other users can be accessed through the 'org/:orgId/members/' endpoint
@Controller(`api/user`)
@ApiTags('user')
export class UserController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natClient: ClientProxy,
  ) {}

  @Get()
  async getProfile(@Req() req: AuthenticatedRequest): Promise<UserDto> {
    return await firstValueFrom(
      this.natClient.send('user.getUser', { userId: req.user.id }),
    );
  }

  @Patch()
  async updateUser(
    @Req() req: AuthenticatedRequest,
    @Body() updates: UserUpdatesDto,
  ): Promise<UserDto> {
    return await firstValueFrom(
      this.natClient.send('user.update', {
        userId: req.user.id,
        userUpdates: updates,
      }),
    );
  }

  @Patch('disable')
  async disableUser(@Req() req: AuthenticatedRequest) {
    return await firstValueFrom(
      this.natClient.send('user.update', {
        userId: req.user.id,
        userUpdates: { disabled: true },
      }),
    );
  }

  @Patch('enable')
  async enableUser(@Req() req: AuthenticatedRequest) {
    return await firstValueFrom(
      this.natClient.send('user.update', {
        userId: req.user.id,
        userUpdates: { disabled: false },
      }),
    );
  }
}
