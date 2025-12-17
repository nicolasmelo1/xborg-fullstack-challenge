import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { EVENTS, GetEventOutput, GetEventInput } from "@xborg/shared/backend";
import { RefreshUseCase } from "../use-cases/refresh.use-case";

@Controller()
export class GetAuthRefreshController {
  constructor(private readonly refreshUseCase: RefreshUseCase) {}

  @MessagePattern(EVENTS.auth.refresh)
  async handle(
    @Payload()
    payload: GetEventInput<typeof EVENTS.auth.refresh>,
  ): Promise<GetEventOutput<typeof EVENTS.auth.refresh>> {
    return await this.refreshUseCase.execute(payload);
  }
}
