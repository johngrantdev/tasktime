import { Body, Controller, Get, Inject, Patch, Req } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthenticatedRequest } from '../shared/interfaces/authenticatedRequest';

// This endpoint is used for own user profile
// Other users can be accessed through the 'org/:orgId/members/' endpoint
@Controller(`api/user`)
@ApiTags('user')
export class UserController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natClient: ClientProxy,
  ) {}

  @Get()
  async getProfile(@Req() req: AuthenticatedRequest): Promise<User> {
    return await firstValueFrom(
      this.natClient.send('entity.getUser', { userId: req.user.id }),
    );
  }

  @Patch()
  async updateUser(
    @Req() req: AuthenticatedRequest,
    @Body() updates: UpdateUserDto,
  ): Promise<User> {
    return await firstValueFrom(
      this.natClient.send('entity.updateUser', {
        userId: req.user.id,
        updates: updates,
      }),
    );
  }

  @Patch('disable')
  async disableUser(@Req() req: AuthenticatedRequest) {
    return await firstValueFrom(
      this.natClient.send('entity.updateUser', {
        userId: req.user.id,
        updates: { disabled: true },
      }),
    );
  }

  @Patch('enable')
  async enableUser(@Req() req: AuthenticatedRequest) {
    return await firstValueFrom(
      this.natClient.send('entity.updateUser', {
        userId: req.user.id,
        updates: { disabled: false },
      }),
    );
  }
}
