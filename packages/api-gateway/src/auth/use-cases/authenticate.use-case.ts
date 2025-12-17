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
import { GetAuthValidateGoogleRequestDto } from "../dtos/get-auth-validate-google.request.dto";

export class AuthenticateUseCase implements Service<
  GetAuthValidateGoogleRequestDto,
  Promise<GetEventOutput<typeof EVENTS.auth.authenticate>>
> {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT)
    private readonly authServiceClient: ClientProxy,
  ) {}

  async execute(
    input: GetAuthValidateGoogleRequestDto,
  ): Promise<GetEventOutput<typeof EVENTS.auth.authenticate>> {
    return await lastValueFrom(
      this.authServiceClient.send<
        GetEventOutput<typeof EVENTS.auth.authenticate>,
        GetEventInput<typeof EVENTS.auth.authenticate>
      >(EVENTS.auth.authenticate, input),
    );
  }
}
