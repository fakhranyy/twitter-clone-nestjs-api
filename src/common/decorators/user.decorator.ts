import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/* we simply created like just calling a function.
   this will be the decorator to get user from our request
*/
export const UserDeco = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    // this means that our decorator will be used only with params
    const request = ctx.switchToHttp().getRequest();

    if (!request.user) {
      return null;
    }

    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);