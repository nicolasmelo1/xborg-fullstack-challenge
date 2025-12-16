import { Reflector } from "@nestjs/core";

export const JwtType = Reflector.createDecorator<
  "accessToken" | "refreshToken"
>();
