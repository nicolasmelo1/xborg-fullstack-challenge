import { Service } from "@xborg/shared/backend";
import { UserEntity } from "../entities/user.entity";
import { Inject, Injectable } from "@nestjs/common";
import { PROFILE_REPOSITORY } from "../profile.contants";
import { ProfileRepository } from "../profile.repository";

@Injectable()
export class CreateProfileUseCase implements Service<
  Omit<UserEntity, "id">,
  Promise<void>
> {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(input: Omit<UserEntity, "id">): Promise<void> {
    await this.profileRepository.create(input);
  }
}
