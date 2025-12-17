import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { EVENTS, GetEventInput, GetEventOutput } from "@xborg/shared/backend";
import { UpdateProfileUseCase } from "../use-cases/update-profile.use-case";

@Controller()
export class PutProfileController {
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {}

  @MessagePattern(EVENTS.user.update)
  async handle(
    @Payload() input: GetEventInput<typeof EVENTS.user.update>,
  ): Promise<GetEventOutput<typeof EVENTS.user.update>> {
    return this.updateProfileUseCase.execute(input);
  }
}
