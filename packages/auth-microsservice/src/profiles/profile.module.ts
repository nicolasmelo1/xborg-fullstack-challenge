import { Module } from "@nestjs/common";
import { GetProfileController } from "./controllers/get-profile.controller";
import { PutProfileController } from "./controllers/put-profile.controller";
import { UpdateProfileUseCase } from "./use-cases/update-profile.use-case";
import { ReadProfileByExternalIdUseCase } from "./use-cases/read-profile-by-external-id.use-case";
import { ReadProfileByGoogleIdUseCase } from "./use-cases/read-profile-by-google-id.use-case";
import { CreateProfileUseCase } from "./use-cases/create-profile.use-case";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { PROFILE_REPOSITORY } from "./profile.contants";
import { ProfileRepository } from "./profile.repository";

const ProfileRepositoryProvider = {
  provide: PROFILE_REPOSITORY,
  useClass: ProfileRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [GetProfileController, PutProfileController],
  providers: [
    ProfileRepositoryProvider,
    ReadProfileByExternalIdUseCase,
    ReadProfileByGoogleIdUseCase,
    UpdateProfileUseCase,
    CreateProfileUseCase,
  ],
  exports: [
    ReadProfileByGoogleIdUseCase,
    CreateProfileUseCase,
    ReadProfileByExternalIdUseCase,
  ],
})
export class ProfileModule {}
