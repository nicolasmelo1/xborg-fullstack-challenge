import { Put, Controller } from "@nestjs/common";
import { UpdateProfileUseCase } from "../use-cases/update-profile.use-case.js";

@Controller("user/profile")
export class PutProfileController {
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {}

  @Put()
  putProfile() {}
}
