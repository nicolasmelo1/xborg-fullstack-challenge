import { Put, Controller, Body, UseGuards } from "@nestjs/common";
import { UpdateProfileUseCase } from "../use-cases/update-profile.use-case.js";
import { PutProfileRequestDto } from "../dtos/put-profile.request.dto.js";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
import { GetAuthenticatedUserExternalId } from "../../auth/decorators/get-authenticated-user-external-id.decorator.js";
import {
  ApiBody,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { ErrorResponseDto } from "../../docs/dtos/error.response.dto";
import {
  PutProfileErrorResponseDto,
  PutProfileSuccessResponseDto,
} from "../dtos/put-profile.response.dto";

@Controller("user/profile")
@ApiTags("user")
export class PutProfileController {
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("session")
  @ApiOperation({
    summary: "Update current user profile",
    description:
      "Updates the authenticated user's profile fields. The user is derived from the session cookie; `externalId` is not accepted from the client.",
  })
  @ApiBody({ type: PutProfileRequestDto })
  @ApiExtraModels(PutProfileSuccessResponseDto, PutProfileErrorResponseDto)
  @ApiResponse({
    status: 200,
    description: "Update result.",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(PutProfileSuccessResponseDto) },
        { $ref: getSchemaPath(PutProfileErrorResponseDto) },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: "Missing/invalid session token.",
    type: ErrorResponseDto,
  })
  async putProfile(
    @Body()
    body: PutProfileRequestDto,
    @GetAuthenticatedUserExternalId()
    externalId: string,
  ) {
    return this.updateProfileUseCase.execute({
      externalId,
      ...body,
    });
  }
}
