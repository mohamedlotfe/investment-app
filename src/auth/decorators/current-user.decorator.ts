import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/models/user.model';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    return request.user;
  },
);
