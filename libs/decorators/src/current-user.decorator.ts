import { User } from '@app/interfaces/user.interface';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): any =>
    getCurrentUserByContext(context),
);
