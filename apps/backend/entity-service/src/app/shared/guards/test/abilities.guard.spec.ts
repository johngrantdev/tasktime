import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
} from '@casl/ability';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OrgDto } from 'tasktime-utils';
import { AbilitiesGuard } from '../abilities.guard';
import {
  AbilityFactory,
  Action,
  AppAbility,
  Subjects,
} from '../../../ability/ability.factory';
import { CHECK_ABILITY } from '../../decorators/abilities.decorator';
import { IS_PUBLIC_KEY } from '../../decorators/skipAuth.decorator';
import { ViewOrgAbility } from '../../../ability/ability.objects';

const context = (payload: object = {}) =>
  ({
    getHandler: () => () => undefined,
    getClass: () => class {},
    switchToRpc: () => ({ getData: () => payload }),
  }) as unknown as ExecutionContext;

// reflector.get returns the handler's rules; getAllAndOverride returns @SkipAuth
const reflector = (rules?: unknown, isPublic = false) =>
  ({
    get: (key: string) => (key === CHECK_ABILITY ? rules : undefined),
    getAllAndOverride: (key: string) =>
      key === IS_PUBLIC_KEY ? isPublic : undefined,
  }) as unknown as Reflector;

// a real CASL ability, so the guard is exercised against the real matcher
const factory = (allowed: boolean) => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  if (allowed) {
    can(Action.Read, OrgDto);
  }
  const ability = build({
    detectSubjectType: (subject) =>
      subject.constructor as ExtractSubjectType<Subjects>,
  });
  return {
    defineAbility: vi.fn().mockResolvedValue(ability),
  } as unknown as AbilityFactory;
};

describe('AbilitiesGuard', () => {
  it('denies a handler that declares no rules', async () => {
    const guard = new AbilitiesGuard(reflector(undefined), factory(true));
    await expect(guard.canActivate(context())).resolves.toBe(false);
  });

  it('denies a handler whose rules are empty', async () => {
    const guard = new AbilitiesGuard(reflector([]), factory(true));
    await expect(guard.canActivate(context())).resolves.toBe(false);
  });

  it('allows a handler that opts out with @SkipAuth', async () => {
    const guard = new AbilitiesGuard(
      reflector(undefined, true),
      factory(false),
    );
    await expect(guard.canActivate(context())).resolves.toBe(true);
  });

  it('allows a declared rule the ability permits', async () => {
    const guard = new AbilitiesGuard(
      reflector([new ViewOrgAbility()]),
      factory(true),
    );
    await expect(
      guard.canActivate(context({ userId: 'u', orgId: 'o' })),
    ).resolves.toBe(true);
  });

  it('rejects a declared rule the ability forbids', async () => {
    const guard = new AbilitiesGuard(
      reflector([{ action: Action.Read, subject: OrgDto }]),
      factory(false),
    );
    await expect(
      guard.canActivate(context({ userId: 'u', orgId: 'o' })),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('denies rather than throwing when membership lookup fails', async () => {
    const throwing = {
      defineAbility: vi.fn().mockRejectedValue(new Error('not a member')),
    } as unknown as AbilityFactory;
    const guard = new AbilitiesGuard(
      reflector([new ViewOrgAbility()]),
      throwing,
    );
    await expect(
      guard.canActivate(context({ userId: 'u', orgId: 'o' })),
    ).resolves.toBe(false);
  });
});
