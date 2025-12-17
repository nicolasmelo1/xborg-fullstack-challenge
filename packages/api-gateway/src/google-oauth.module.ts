import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";

export const GOOGLE_OUATH_CLIENT = Symbol("GOOGLE_OUATH_CLIENT");

@Module({})
export class GoogleOAuthModule {
  static forRoot(): DynamicModule {
    return {
      module: GoogleOAuthModule,
      providers: [
        {
          provide: GOOGLE_OUATH_CLIENT,
          useFactory: (configService: ConfigService) => {
            return new OAuth2Client({
              clientId: configService.get("GOOGLE_CLIENT_ID"),
              clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
            });
          },
          inject: [ConfigService],
        },
      ],
      exports: [GOOGLE_OUATH_CLIENT],
    };
  }
}
