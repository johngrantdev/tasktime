import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto, UserIdDto, UserUpdatesDto } from 'tasktime-utils';
import { User } from './entities/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { userToDto } from './utils/userToDto';

const USER_NOT_FOUND = 'User not found';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async getOrCreateUserByEmail(email: string): Promise<UserIdDto> {
    let user: UserDto;
    try {
      user = await this.getUserByEmail(email);
    } catch (error) {
      user = await this.createUser(email);
    }
    return { id: user.id };
  }

  async getUser(userId: string): Promise<UserDto> {
    const localEm = this.em.fork();
    const user = await localEm.findOne(User, { id: userId });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return userToDto(user);
  }

  // used to lookup user during authentication
  async getUserByEmail(email: string): Promise<UserDto> {
    const localEm = this.em.fork();
    const user = await localEm.findOne(User, { email: email });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return userToDto(user);
  }

  async createUser(email: string): Promise<UserDto> {
    const localEm = this.em.fork();
    const user = new User(email);
    await localEm.persistAndFlush(user);
    return userToDto(user);
  }

  async updateUser(userId: string, updates: UserUpdatesDto): Promise<UserDto> {
    const localEm = this.em.fork();
    const user = await localEm.findOne(User, { id: userId });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    localEm.assign(user, updates);
    await localEm.persistAndFlush(user);
    return userToDto(user);
  }

  async handleRevokeAllTokenValidity(userId: string) {
    const localEm = this.em.fork();
    const user = await localEm.findOne(User, { id: userId });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    // reset the revocation timestamp to now.
    localEm.assign(user, { revocationTimestamp: new Date() });
    await localEm.persistAndFlush(user);
  }

  // async handleInvitedOrgMember(
  //   userId: string,
  //   orgId: string,
  //   inviteData: InviteToOrgDto
  // ) {
  //   // get/create invitee user
  //   let invitedUser = await this.getUserByEmail(inviteData.email);
  //   if (!invitedUser) {
  //     invitedUser = await this.createUser(inviteData.email);
  //   }
  //   // get inviting user
  //   const invitedBy = await this.userRepository.findOne({ id: userId });
  //   // event: recieved by org to add user to org
  //   this.eventEmitter.emit(
  //     'user.invitedToOrg',
  //     new UserInvitedToOrgEvent(
  //       invitedUser.id,
  //       invitedUser.email,
  //       orgId,
  //       inviteData.role,
  //       new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
  //       invitedBy.id,
  //       invitedBy.firstName
  //     )
  //   );
  // }
}
