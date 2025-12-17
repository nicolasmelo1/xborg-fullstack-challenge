import {
  Controller,
  Res,
  HttpException,
  Get,
  Query,
  ValidationPipe,
  Req,
  Redirect,
} from "@nestjs/common";
import { GetAuthValidateGoogleRequestDto } from "../dtos/get-auth-validate-google.request.dto";
import { AuthenticateUseCase } from "../use-cases/authenticate.use-case";
import type { Request, Response } from "express";
import { COOKIE_SESSION, COOKIE_REFRESH_TOKEN } from "@xborg/shared/all";
import { REDIRECT_URL_COOKIE } from "../auth.constants";

@Controller("auth/validate/google")
export class GetAuthValidateGoogleController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  @Get()
  @Redirect(process.env.FRONTEND_ORIGIN, 302)
  async create(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
        },
      }),
    )
    query: GetAuthValidateGoogleRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const redirectUrl = req.cookies[REDIRECT_URL_COOKIE];
    const result = await this.authenticateUseCase.execute(query);

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

    return {
      url: redirectUrl,
    };
  }
}
