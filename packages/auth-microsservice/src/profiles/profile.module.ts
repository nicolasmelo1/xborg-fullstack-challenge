import { Module } from "@nestjs/common";
import { GetProfileController } from "./controllers/get-profile.controller.js";
import { PutProfileController } from "./controllers/put-profile.controller.js";
import { UpdateProfileUseCase } from "./use-cases/update-profile.use-case.js";
import { GetProfileUseCase } from "./use-cases/get-profile.use-case.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { PROFILE_REPOSITORY } from "./profile.contants.js";
import { ProfileRepository } from "./profile.repository.js";

const ProfileRepositoryProvider = {
  provide: PROFILE_REPOSITORY,
  useClass: ProfileRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [GetProfileController, PutProfileController],
  providers: [
    ProfileRepositoryProvider,
    GetProfileUseCase,
    UpdateProfileUseCase,
  ],
})
export class ProfileModule {}
