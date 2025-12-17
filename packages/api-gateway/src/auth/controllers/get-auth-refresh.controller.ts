import { Controller, Res, UseGuards, HttpException, Get } from "@nestjs/common";
import type { Response } from "express";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { JwtType } from "../decorators/jwt-type.decorator";
import { RefreshUseCase } from "../use-cases/refresh.use-case";
import { COOKIE_REFRESH_TOKEN, COOKIE_SESSION } from "@xborg/shared/all";
import { GetAuthenticatedUserExternalId } from "../decorators/get-authenticated-user-external-id.decorator";

@Controller("auth/refresh")
export class GetAuthRefreshController {
  constructor(private readonly refreshUseCase: RefreshUseCase) {}
  @Get()
  @JwtType("refreshToken")
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @GetAuthenticatedUserExternalId()
    externalId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.refreshUseCase.execute(externalId);

    if (!result.success) throw new HttpException(result.error, 401);

    res.cookie(COOKIE_SESSION, result.accessToken, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.cookie(COOKIE_REFRESH_TOKEN, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return;
  }
}
