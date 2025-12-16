import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { JwtType } from "../decorators/jwt-type.decorator";
import { COOKIE_REFRESH_TOKEN, COOKIE_SESSION } from "@xborg/shared/all";

type RequestWithUser = Request & {
  user?: {
    sub: string;
    email?: string;
  };
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const jwtType =
      this.reflector.get(JwtType, context.getHandler()) ?? "accessToken";

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const cookies = this.extractCookies(req);
    if (!cookies) throw new UnauthorizedException("Missing session token");

    const tokenByType =
      cookies[
        jwtType === "accessToken" ? COOKIE_SESSION : COOKIE_REFRESH_TOKEN
      ];
    if (!tokenByType) throw new UnauthorizedException("Missing session token");

    const secret = this.configService.get<string>("JWT_PRIVATE_KEY");
    if (!secret) throw new UnauthorizedException("JWT secret not configured");

    try {
      const payload = jwt.verify(tokenByType, secret) as jwt.JwtPayload;
      if (!payload.sub) throw new Error("Token missing subject");

      req.user = {
        sub: String(payload.sub),
        email: typeof payload.email === "string" ? payload.email : undefined,
      };
      return true;
    } catch (error) {
      this.logger.error((error as Error).message);
      throw new UnauthorizedException("Invalid session token");
    }
  }

  private extractCookies(request: Request): Record<string, string> | undefined {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return undefined;

    const cookies = cookieHeader.split(";").reduce(
      (acc, cookie) => {
        const [key, ...rest] = cookie.trim().split("=");
        acc[key as string] = rest.join("=");
        return acc;
      },
      {} as Record<string, string>,
    );

    return cookies;
  }
}
