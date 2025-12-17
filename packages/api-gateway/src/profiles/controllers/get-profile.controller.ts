import { Get, Controller, UseGuards, HttpException } from "@nestjs/common";
import { GetProfileUseCase } from "../use-cases/get-profile.use-case";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { GetAuthenticatedUserExternalId } from "../../auth/decorators/get-authenticated-user-external-id.decorator";
import { firstValueFrom } from "rxjs";
import { GetProfileResponseDto } from "../dtos/get-profile.response.dto";
import { plainToInstance } from "class-transformer";
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ErrorResponseDto } from "../../docs/dtos/error.response.dto";

@Controller("user/profile")
@ApiTags("user")
export class GetProfileController {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("session")
  @ApiOperation({
    summary: "Get current user profile",
    description:
      "Returns the authenticated user's profile based on the session cookie.",
  })
  @ApiResponse({
    status: 200,
    description: "User profile.",
    type: GetProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Missing/invalid session token.",
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Profile not found.",
    type: ErrorResponseDto,
  })
  async getProfile(
    @GetAuthenticatedUserExternalId()
    externalId: string,
  ) {
    const profile = await firstValueFrom(
      this.getProfileUseCase.execute(externalId),
    );
    if (!profile.success) throw new HttpException(profile.error, 404);

    return plainToInstance(GetProfileResponseDto, profile.user, {
      excludeExtraneousValues: true,
    });
  }
}
