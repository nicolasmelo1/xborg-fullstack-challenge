import {
  Controller,
  Res,
  Redirect,
  Get,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import type { Response } from "express";
import { BuildGoogleUrlUseCase } from "../use-cases/build-google-url.use-case";
import { GetAuthLoginGoogleRequestDto } from "../dtos/get-auth-login-google.request.dto";
import { REDIRECT_URL_COOKIE } from "../auth.constants";

@Controller("auth/login/google")
export class GetAuthLoginGoogleController {
  constructor(private readonly buildGoogleUrlUseCase: BuildGoogleUrlUseCase) {}

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
    query: GetAuthLoginGoogleRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.buildGoogleUrlUseCase.execute();

    console.log(result, {
      redirectUrl: query.redirectUrl,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie(REDIRECT_URL_COOKIE, query.redirectUrl, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return {
      url: result,
    };
  }
}
