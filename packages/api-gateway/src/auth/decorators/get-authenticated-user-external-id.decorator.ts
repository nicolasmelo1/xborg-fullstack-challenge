import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

export const GetAuthenticatedUserExternalId = createParamDecorator(
  (_opts: undefined, ctx: ExecutionContext): string => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: { sub: string } }>();
    if (request?.user?.sub === undefined)
      throw new UnauthorizedException("Missing authentication headers");

    return request.user.sub;
  },
);
