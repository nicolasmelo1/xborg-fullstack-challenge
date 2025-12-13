import { Controller } from "@nestjs/common";
import { GetProfileUseCase } from "../use-cases/get-profile.use-case.js";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { EVENTS, GetEventInput, GetEventOutput } from "@xborg/shared/backend";

@Controller()
export class GetProfileController {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

  @MessagePattern(EVENTS.user.read)
  async getHello(
    @Payload() input: GetEventInput<typeof EVENTS.user.read>,
  ): Promise<GetEventOutput<typeof EVENTS.user.read>> {
    return this.getProfileUseCase.execute(input);
  }
}
