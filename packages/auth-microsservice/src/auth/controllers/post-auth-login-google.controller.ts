import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { EVENTS, GetEventOutput, GetEventInput } from "@xborg/shared/backend";
import { AuthenticateUseCase } from "../use-cases/authenticate.use-case";

@Controller()
export class PostAuthLoginGoogleController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  @MessagePattern(EVENTS.auth.authenticate)
  async handle(
    @Payload()
    payload: GetEventInput<typeof EVENTS.auth.authenticate>,
  ): Promise<GetEventOutput<typeof EVENTS.auth.authenticate>> {
    return await this.authenticateUseCase.execute(payload);
  }
}
