import { Inject } from "@nestjs/common";
import {
  EVENTS,
  GetEventInput,
  GetEventOutput,
  Service,
} from "@xborg/shared/backend";
import { PROFILE_REPOSITORY } from "../profile.contants";
import { ProfileRepository } from "../profile.repository";
import { ReadProfileByExternalIdUseCase } from "./read-profile-by-external-id.use-case";

export class UpdateProfileUseCase implements Service<
  GetEventInput<typeof EVENTS.user.update>,
  Promise<GetEventOutput<typeof EVENTS.user.update>>
> {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    private readonly readProfileByExternalIdUseCase: ReadProfileByExternalIdUseCase,
  ) {}

  async execute(
    input: GetEventInput<typeof EVENTS.user.update>,
  ): Promise<GetEventOutput<typeof EVENTS.user.update>> {
    const maybeUser = await this.readProfileByExternalIdUseCase.execute(
      input.externalId,
    );
    if (!maybeUser.success)
      return {
        success: false,
        error: "User not found",
      };

    await this.profileRepository.update(input);

    return {
      success: true,
    };
  }
}
