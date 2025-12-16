import { Post, Body, Controller, Res, HttpException } from "@nestjs/common";
import { PostAuthLoginGoogleRequestDto } from "../dtos/post-auth-login-google.request.dto";
import { AuthenticateUseCase } from "../use-cases/authenticate.use-case";
import type { Response } from "express";
import { COOKIE_SESSION, COOKIE_REFRESH_TOKEN } from "@xborg/shared/all";

@Controller("auth/login/google")
export class PostAuthLoginGoogleController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  async create(
    @Body()
    body: PostAuthLoginGoogleRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authenticateUseCase.execute(body);

    if (!result.success) throw new HttpException(result.error, 401);

    res.cookie(COOKIE_SESSION, result.accessToken, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.cookie(COOKIE_REFRESH_TOKEN, result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return;
  }
}
