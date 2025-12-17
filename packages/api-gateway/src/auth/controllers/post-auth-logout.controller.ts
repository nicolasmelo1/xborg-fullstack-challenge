import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { COOKIE_SESSION, COOKIE_REFRESH_TOKEN } from "@xborg/shared/all";

@Controller("auth/logout")
export class PostAuthLogoutController {
  @Post()
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_SESSION);
    res.clearCookie(COOKIE_REFRESH_TOKEN);

    return;
  }
}
