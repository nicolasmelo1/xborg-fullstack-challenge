import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { EVENTS, GetEventInput, GetEventOutput } from "@xborg/shared/backend";
import { ReadProfileByExternalIdUseCase } from "../use-cases/read-profile-by-external-id.use-case";

@Controller()
export class GetProfileController {
  constructor(
    private readonly readProfileExternalIdUseCase: ReadProfileByExternalIdUseCase,
  ) {}

  @MessagePattern(EVENTS.user.read)
  async getHello(
    @Payload() input: GetEventInput<typeof EVENTS.user.read>,
  ): Promise<GetEventOutput<typeof EVENTS.user.read>> {
    return this.readProfileExternalIdUseCase.execute(input);
  }
}
