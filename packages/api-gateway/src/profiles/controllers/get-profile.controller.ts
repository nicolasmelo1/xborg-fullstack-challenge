import { Get, Controller, UseGuards } from "@nestjs/common";
import { GetProfileUseCase } from "../use-cases/get-profile.use-case.js";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
import { GetAuthenticatedUserExternalId } from "../../auth/decorators/get-authenticated-user-external-id.decorator.js";

@Controller("user/profile")
export class GetProfileController {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @GetAuthenticatedUserExternalId()
    externalId: string,
  ) {
    return this.getProfileUseCase.execute(externalId);
  }
}
