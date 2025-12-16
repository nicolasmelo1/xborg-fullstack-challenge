import { Get, Controller, UseGuards, HttpException } from "@nestjs/common";
import { GetProfileUseCase } from "../use-cases/get-profile.use-case";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { GetAuthenticatedUserExternalId } from "../../auth/decorators/get-authenticated-user-external-id.decorator";
import { firstValueFrom } from "rxjs";
import { GetProfileResponseDto } from "../dtos/get-profile.response.dto";
import { plainToInstance } from "class-transformer";

@Controller("user/profile")
export class GetProfileController {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
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
