import { UserDto } from 'tasktime-utils';
import { User } from '../entities/user.entity';

export function userToDto(user: User): UserDto {
  const dto = new UserDto({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    lastLoginAt: user.lastLoginAt,
    disabled: user.disabled,
    revocationTimestamp: user.revocationTimestamp,
  });
  return dto;
}
