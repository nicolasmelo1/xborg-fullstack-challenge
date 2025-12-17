import {
  EVENTS,
  type Service,
  type GetEventInput,
  type GetEventOutput,
} from "@xborg/shared/backend";
import { Inject, Injectable } from "@nestjs/common";
import { AUTH_SERVICE_CLIENT } from "../../messaging.module";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Injectable()
export class GetProfileUseCase implements Service<
  string,
  Observable<GetEventOutput<typeof EVENTS.user.read>>
> {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT)
    private readonly authServiceClient: ClientProxy,
  ) {}

  execute(
    externalId: string,
  ): Observable<GetEventOutput<typeof EVENTS.user.read>> {
    return this.authServiceClient.send<
      GetEventOutput<typeof EVENTS.user.read>,
      GetEventInput<typeof EVENTS.user.read>
    >(EVENTS.user.read, externalId);
  }
}
