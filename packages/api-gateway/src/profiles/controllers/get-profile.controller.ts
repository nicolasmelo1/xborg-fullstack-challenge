import { Get, Controller } from "@nestjs/common";
import { GetProfileUseCase } from "../use-cases/get-profile.use-case.js";

@Controller("user/profile")
export class GetProfileController {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

  @Get()
  async getProfile() {
    return this.getProfileUseCase.execute();
  }
}
