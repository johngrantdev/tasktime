import { User } from '../entities/user.entity';

describe('User', () => {
  it('starts with no token revoked', () => {
    // A signup-time default revokes the access token minted in that same
    // second, which denied every new user's first request.
    expect(new User('someone@example.test').revocationTimestamp.getTime()).toBe(
      0,
    );
  });
});
