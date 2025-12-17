import { Inject } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { GOOGLE_OUATH_CLIENT } from "../../google-oauth.module";
import { Service } from "@xborg/shared/backend";
import { ConfigService } from "@nestjs/config";

export class BuildGoogleUrlUseCase implements Service<void, string> {
  constructor(
    @Inject(GOOGLE_OUATH_CLIENT)
    private readonly googleClient: OAuth2Client,
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {}

  execute(): string {
    const redirectUrl = this.config.get("GOOGLE_REDIRECT_URI");

    const url = this.googleClient.generateAuthUrl({
      access_type: "online",
      scope: ["openid", "email", "profile"],
      prompt: "select_account",
      redirect_uri: redirectUrl,
    });

    return url;
  }
}
