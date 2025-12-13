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

export class AuthenticateUseCase implements Service<any, any> {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT)
    private readonly authServiceClient: ClientProxy,
  ) {}

  async execute() {
    return lastValueFrom(
      this.authServiceClient.send<
        GetEventOutput<typeof EVENTS.auth.authenticate>,
        GetEventInput<typeof EVENTS.auth.authenticate>
      >(EVENTS.auth.authenticate, []),
    );
  }
}
