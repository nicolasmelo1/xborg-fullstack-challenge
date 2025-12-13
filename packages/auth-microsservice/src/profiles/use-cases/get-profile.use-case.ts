import {
  EVENTS,
  type Service,
  type GetEventOutput,
  GetEventInput,
} from "@xborg/shared/backend";
import { Inject, Injectable } from "@nestjs/common";
import { PROFILE_REPOSITORY } from "../profile.contants";
import { ProfileRepository } from "../profile.repository";

@Injectable()
export class GetProfileUseCase implements Service<
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
    return this.profileRepository.getByExternalId(input);
  }
}
