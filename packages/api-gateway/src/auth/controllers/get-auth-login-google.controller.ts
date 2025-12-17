import {
  Controller,
  Res,
  Redirect,
  Get,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import type { Response } from "express";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BuildGoogleUrlUseCase } from "../use-cases/build-google-url.use-case";
import { GetAuthLoginGoogleRequestDto } from "../dtos/get-auth-login-google.request.dto";
import { REDIRECT_URL_COOKIE } from "../auth.constants";
import { ErrorResponseDto } from "../../docs/dtos/error.response.dto";
import { GetAUthLoginGoogleResponseDto } from "../dtos/get-auth-login-google.response.dto";

@Controller("auth/login/google")
@ApiTags("auth")
export class GetAuthLoginGoogleController {
  constructor(private readonly buildGoogleUrlUseCase: BuildGoogleUrlUseCase) {}

  @Get()
  @Redirect(process.env.FRONTEND_ORIGIN, 302)
  @ApiOperation({
    summary: "Start Google OAuth login",
    description:
      "Redirects to Google's OAuth consent screen and stores the final redirect URL in an HTTP-only cookie.",
  })
  @ApiQuery({
    name: "redirectUrl",
    required: true,
    description:
      "Where the backend should redirect after Google validates the login (web popup callback URL).",
    example: "http://localhost:3000/signin/callback",
  })
  @ApiResponse({
    status: 302,
    description: "Redirects to Google OAuth consent screen.",
    type: GetAUthLoginGoogleResponseDto,
    headers: {
      Location: { description: "Google OAuth consent URL." },
      "Set-Cookie": {
        description: `Sets an HTTP-only cookie (${REDIRECT_URL_COOKIE}) used to know where to redirect after validation.`,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid query parameters.",
    type: ErrorResponseDto,
  })
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
