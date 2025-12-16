import { forwardRef, Module } from "@nestjs/common";
import { PostAuthLoginGoogleController } from "./controllers/post-auth-login-google.controller";
import { AuthenticateUseCase } from "./use-cases/authenticate.use-case";
import { SignTokenUseCase } from "./use-cases/sign-token.use-case";
import { ProfileModule } from "src/profiles/profile.module";
import { RefreshUseCase } from "./use-cases/refresh.use-case";
import { GetAuthRefreshController } from "./controllers/get-auth-refresh.controller";
import { GoogleOAuthModule } from "src/google-oauth.module";

@Module({
  imports: [forwardRef(() => ProfileModule), GoogleOAuthModule.forRoot()],
  providers: [AuthenticateUseCase, SignTokenUseCase, RefreshUseCase],
  controllers: [PostAuthLoginGoogleController, GetAuthRefreshController],
})
export class AuthModule {}
