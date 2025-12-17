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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetAuthValidateGoogleRequestDto } from "../dtos/get-auth-validate-google.request.dto";
import { AuthenticateUseCase } from "../use-cases/authenticate.use-case";
import type { Request, Response } from "express";
import { COOKIE_SESSION, COOKIE_REFRESH_TOKEN } from "@xborg/shared/all";
import { REDIRECT_URL_COOKIE } from "../auth.constants";
import { ErrorResponseDto } from "../../docs/dtos/error.response.dto";
import { GetAuthValidateGoogleResponseDto } from "../dtos/get-auth-validate-google.response.dto";

@Controller("auth/validate/google")
@ApiTags("auth")
export class GetAuthValidateGoogleController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  @Get()
  @Redirect(process.env.FRONTEND_ORIGIN, 302)
  @ApiOperation({
    summary: "Validate Google OAuth login",
    description:
      "Exchanges the Google OAuth `code` for tokens, sets HTTP-only JWT cookies, and redirects to the previously stored redirect URL.",
  })
  @ApiQuery({
    name: "code",
    required: true,
    description: "Authorization code returned by Google OAuth.",
    example: "4/0ATX87lN...",
  })
  @ApiResponse({
    status: 302,
    description: "Login succeeded; redirects back to the web app.",
    type: GetAuthValidateGoogleResponseDto,
    headers: {
      Location: { description: "Redirect URL (web app callback/page)." },
      "Set-Cookie": {
        description: `Sets ${COOKIE_SESSION} and ${COOKIE_REFRESH_TOKEN} HTTP-only cookies.`,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid Google code or authentication failed.",
    type: ErrorResponseDto,
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
