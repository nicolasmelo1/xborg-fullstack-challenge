import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {
  EVENTS,
  GetEventInput,
  GetEventOutput,
  Service,
} from "@xborg/shared/backend";
import { AUTH_SERVICE_CLIENT } from "src/messaging.module";
import { lastValueFrom } from "rxjs";

export class RefreshUseCase implements Service<
  GetEventInput<typeof EVENTS.auth.refresh>,
  Promise<GetEventOutput<typeof EVENTS.auth.refresh>>
> {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT)
    private readonly authServiceClient: ClientProxy,
  ) {}

  async execute(
    input: GetEventInput<typeof EVENTS.auth.refresh>,
  ): Promise<GetEventOutput<typeof EVENTS.auth.refresh>> {
    return await lastValueFrom(
      this.authServiceClient.send<
        GetEventOutput<typeof EVENTS.auth.refresh>,
        GetEventInput<typeof EVENTS.auth.refresh>
      >(EVENTS.auth.refresh, input),
    );
  }
}
