import { Controller, Res, UseGuards, HttpException, Get } from "@nestjs/common";
import type { Response } from "express";
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { JwtType } from "../decorators/jwt-type.decorator";
import { RefreshUseCase } from "../use-cases/refresh.use-case";
import { COOKIE_REFRESH_TOKEN, COOKIE_SESSION } from "@xborg/shared/all";
import { GetAuthenticatedUserExternalId } from "../decorators/get-authenticated-user-external-id.decorator";
import { ErrorResponseDto } from "../../docs/dtos/error.response.dto";

@Controller("auth/refresh")
@ApiTags("auth")
export class GetAuthRefreshController {
  constructor(private readonly refreshUseCase: RefreshUseCase) {}

  @Get()
  @JwtType("refreshToken")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("refreshToken")
  @ApiOperation({
    summary: "Refresh session",
    description:
      "Uses the refresh token cookie to mint a new access token and refresh token (sent back via Set-Cookie).",
  })
  @ApiResponse({
    status: 200,
    description: "Cookies refreshed successfully (no response body).",
    headers: {
      "Set-Cookie": {
        description: `Sets ${COOKIE_SESSION} and ${COOKIE_REFRESH_TOKEN} HTTP-only cookies.`,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Missing/invalid refresh token.",
    type: ErrorResponseDto,
  })
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
