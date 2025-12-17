import {
  EVENTS,
  GetEventInput,
  GetEventOutput,
  Service,
} from "@xborg/shared/backend";
import { Injectable } from "@nestjs/common";
import { SignTokenUseCase } from "./sign-token.use-case";
import { ReadProfileByExternalIdUseCase } from "src/profiles/use-cases/read-profile-by-external-id.use-case";

@Injectable()
export class RefreshUseCase implements Service<
  GetEventInput<typeof EVENTS.auth.refresh>,
  Promise<GetEventOutput<typeof EVENTS.auth.refresh>>
> {
  constructor(
    private readonly readProfileExternalIdUseCase: ReadProfileByExternalIdUseCase,
    private readonly signTokenUseCase: SignTokenUseCase,
  ) {}

  async execute(
    input: GetEventInput<typeof EVENTS.auth.refresh>,
  ): Promise<GetEventOutput<typeof EVENTS.auth.refresh>> {
    const maybeUser = await this.readProfileExternalIdUseCase.execute(input);
    if (!maybeUser.success)
      return {
        success: false,
        error: "No user found",
      };

    const { accessToken, refreshToken } = this.signTokenUseCase.execute({
      externalId: input,
      email: maybeUser.user.email ?? "",
    });

    return {
      success: true,
      accessToken,
      refreshToken,
    };
  }
}
