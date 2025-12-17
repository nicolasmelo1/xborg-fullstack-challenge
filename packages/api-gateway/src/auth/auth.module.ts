import { Module } from "@nestjs/common";
import { PostAuthLogoutController } from "./controllers/post-auth-logout.controller";
import { AuthenticateUseCase } from "./use-cases/authenticate.use-case";
import { GetAuthRefreshController } from "./controllers/get-auth-refresh.controller";
import { RefreshUseCase } from "./use-cases/refresh.use-case";
import { GoogleOAuthModule } from "src/google-oauth.module";
import { BuildGoogleUrlUseCase } from "./use-cases/build-google-url.use-case";
import { GetAuthLoginGoogleController } from "./controllers/get-auth-login-google.controller";
import { GetAuthValidateGoogleController } from "./controllers/get-auth-validate-google.controller";

@Module({
  imports: [GoogleOAuthModule.forRoot()],
  providers: [AuthenticateUseCase, RefreshUseCase, BuildGoogleUrlUseCase],
  controllers: [
    GetAuthRefreshController,
    PostAuthLogoutController,
    GetAuthLoginGoogleController,
    GetAuthValidateGoogleController,
  ],
})
export class AuthModule {}
