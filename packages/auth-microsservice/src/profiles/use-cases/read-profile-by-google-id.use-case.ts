import { type Service } from "@xborg/shared/backend";
import { Inject, Injectable } from "@nestjs/common";
import { PROFILE_REPOSITORY } from "../profile.contants";
import { ProfileRepository } from "../profile.repository";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class ReadProfileByGoogleIdUseCase implements Service<
  UserEntity["googleId"],
  Promise<UserEntity | undefined>
> {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(
    input: UserEntity["googleId"],
  ): Promise<UserEntity | undefined> {
    return this.profileRepository.getByGoogleId(input);
  }
}
