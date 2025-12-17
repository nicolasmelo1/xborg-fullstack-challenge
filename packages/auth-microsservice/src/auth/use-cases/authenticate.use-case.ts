import {
  EVENTS,
  GetEventInput,
  GetEventOutput,
  Service,
} from "@xborg/shared/backend";
import { OAuth2Client } from "google-auth-library";
import { ConfigService } from "@nestjs/config";
import { Inject } from "@nestjs/common";
import { CreateProfileUseCase } from "src/profiles/use-cases/create-profile.use-case";
import { SignTokenUseCase } from "./sign-token.use-case";
import { ReadProfileByGoogleIdUseCase } from "../../profiles/use-cases/read-profile-by-google-id.use-case";
import { GOOGLE_OUATH_CLIENT } from "../../google-oauth.module";

export class AuthenticateUseCase implements Service<
  GetEventInput<typeof EVENTS.auth.authenticate>,
  Promise<GetEventOutput<typeof EVENTS.auth.authenticate>>
> {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(GOOGLE_OUATH_CLIENT)
    private readonly googleClient: OAuth2Client,
    private readonly readProfileGoogleIdUseCase: ReadProfileByGoogleIdUseCase,
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly signTokenUseCase: SignTokenUseCase,
  ) {}

  async execute(
    input: GetEventInput<typeof EVENTS.auth.authenticate>,
  ): Promise<GetEventOutput<typeof EVENTS.auth.authenticate>> {
    if (!input.code) return { success: false, error: "No code" };
    const { tokens } = await this.googleClient.getToken({
      code: input.code,
      redirect_uri: this.configService.get("GOOGLE_REDIRECT_URI"),
    });

    if (!tokens.id_token) {
      return {
        success: false,
        error: "No id_token",
      };
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: this.configService.get("GOOGLE_CLIENT_ID"),
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return {
        success: false,
        error: "Invalid token",
      };
    }

    const user = await this.readProfileGoogleIdUseCase.execute(payload.sub);

    const externalId = user?.externalId ?? crypto.randomUUID();
    if (!user)
      await this.createProfileUseCase.execute({
        externalId,
        googleId: payload.sub,
        email: payload.email ?? "",
        firstName: payload.given_name ?? null,
        lastName: payload.family_name ?? null,
        picture: payload.picture ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const { accessToken, refreshToken } = this.signTokenUseCase.execute({
      externalId: externalId,
      email: payload.email ?? "",
    });

    return {
      success: true,
      accessToken,
      refreshToken,
    };
  }
}
