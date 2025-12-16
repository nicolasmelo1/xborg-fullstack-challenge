import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProfileModule } from "./profiles/profile.module";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database.module";
import { GoogleOAuthModule } from "./google-oauth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    GoogleOAuthModule,
    ProfileModule,
    AuthModule,
  ],
})
export class AppModule {}
