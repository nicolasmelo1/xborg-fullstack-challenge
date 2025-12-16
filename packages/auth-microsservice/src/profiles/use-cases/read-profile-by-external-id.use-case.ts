import {
  EVENTS,
  GetEventInput,
  GetEventOutput,
  type Service,
} from "@xborg/shared/backend";
import { Inject, Injectable } from "@nestjs/common";
import { PROFILE_REPOSITORY } from "../profile.contants";
import { ProfileRepository } from "../profile.repository";

@Injectable()
export class ReadProfileByExternalIdUseCase implements Service<
  GetEventInput<typeof EVENTS.user.read>,
  Promise<GetEventOutput<typeof EVENTS.user.read>>
> {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(
    input: GetEventInput<typeof EVENTS.user.read>,
  ): Promise<GetEventOutput<typeof EVENTS.user.read>> {
    const user = await this.profileRepository.getByExternalId(input);

    if (!user) return { success: false, error: "User not found" };
    return { success: true, user };
  }
}
