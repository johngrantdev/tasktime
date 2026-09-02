import { ForbiddenError } from '@casl/ability';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequiredRule, CHECK_ABILITY } from '../decorators/abilities.decorator';
import { AbilityFactory } from '../../ability/ability.factory';
import { IS_PUBLIC_KEY } from '../decorators/skipAuth.decorator';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // aknowledge SkipAuth decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    // A handler that declares no rules has not been reviewed for access
    // control, so it is denied rather than silently allowed. Handlers that
    // only ever touch the caller's own rows opt out with @SkipAuth.
    if (rules.length === 0) {
      return false;
    }

    const payload = context.switchToRpc().getData();

    try {
      // building the ability reads membership rows, and a missing membership
      // throws - that is a denial, not a server error.
      const ability = await this.caslAbilityFactory.defineAbility({
        userId: payload.userId,
        orgId: payload.orgId,
        projectId: payload.projectId,
        itemId: payload.itemId,
      });

      for (const rule of rules) {
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new RpcException(error.message);
      }
    }
    return false;
  }
}
