import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract current user from request
 * Usage: @CurrentUser() user: User
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

