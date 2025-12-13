import { Module } from "@nestjs/common";
import { GetProfileController } from "./controllers/get-profile.controller.js";
import { PutProfileController } from "./controllers/put-profile.controller.js";
import { UpdateProfileUseCase } from "./use-cases/update-profile.use-case.js";
import { GetProfileUseCase } from "./use-cases/get-profile.use-case.js";

@Module({
  imports: [],
  controllers: [GetProfileController, PutProfileController],
  providers: [GetProfileUseCase, UpdateProfileUseCase],
})
export class ProfileModule {}
