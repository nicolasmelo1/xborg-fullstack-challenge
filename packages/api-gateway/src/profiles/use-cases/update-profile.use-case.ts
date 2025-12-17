import {
  EVENTS,
  GetEventInput,
  GetEventOutput,
  Service,
} from "@xborg/shared/backend";
import { Inject } from "@nestjs/common";
import { AUTH_SERVICE_CLIENT } from "src/messaging.module";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateUserInput } from "@xborg/shared/all";
import { Observable } from "rxjs";

export class UpdateProfileUseCase implements Service<
  UpdateUserInput,
  Observable<GetEventOutput<typeof EVENTS.user.update>>
> {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT)
    private readonly authServiceClient: ClientProxy,
  ) {}

  execute(
    input: UpdateUserInput,
  ): Observable<GetEventOutput<typeof EVENTS.user.update>> {
    return this.authServiceClient.send<
      GetEventOutput<typeof EVENTS.user.update>,
      GetEventInput<typeof EVENTS.user.update>
    >(EVENTS.user.update, input);
  }
}
