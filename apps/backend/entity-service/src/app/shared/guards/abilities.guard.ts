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

    const payload = context.switchToRpc().getData();
    console.log(payload.userId);
    console.log(payload.orgId);

    const ability = await this.caslAbilityFactory.defineAbility({
      userId: payload.userId,
      orgId: payload.orgId,
      projectId: payload.projectId,
      itemId: payload.itemId,
    });

    try {
      rules.forEach((rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
      );

      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new RpcException(error.message);
      }
    }
    return false;
  }
}
