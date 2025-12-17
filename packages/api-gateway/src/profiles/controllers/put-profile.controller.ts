import { Put, Controller, Body, UseGuards } from "@nestjs/common";
import { UpdateProfileUseCase } from "../use-cases/update-profile.use-case.js";
import { PutProfileRequestDto } from "../dtos/put-profile.request.dto.js";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
import { GetAuthenticatedUserExternalId } from "../../auth/decorators/get-authenticated-user-external-id.decorator.js";

@Controller("user/profile")
export class PutProfileController {
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {}

  @Put()
  @UseGuards(JwtAuthGuard)
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
