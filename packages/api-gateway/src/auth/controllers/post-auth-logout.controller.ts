import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { COOKIE_SESSION, COOKIE_REFRESH_TOKEN } from "@xborg/shared/all";
import { ErrorResponseDto } from "../../docs/dtos/error.response.dto";

@Controller("auth/logout")
@ApiTags("auth")
export class PostAuthLogoutController {
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("session")
  @ApiOperation({
    summary: "Log out",
    description:
      "Clears session cookies. Requires a valid session cookie to prevent CSRF-style logout attempts.",
  })
  @ApiResponse({
    status: 200,
    description: "Logged out successfully (cookies cleared; no response body).",
    headers: {
      "Set-Cookie": { description: "Clears cookies via Set-Cookie headers." },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Missing/invalid session token.",
    type: ErrorResponseDto,
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_SESSION);
    res.clearCookie(COOKIE_REFRESH_TOKEN);

    return;
  }
}
