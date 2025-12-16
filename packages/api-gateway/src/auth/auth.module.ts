import { Module } from "@nestjs/common";
import { PostAuthLoginGoogleController } from "./controllers/post-auth-login-google.controller";
import { PostAuthLogoutController } from "./controllers/post-auth-logout.controller";
import { AuthenticateUseCase } from "./use-cases/authenticate.use-case";
import { GetAuthRefreshController } from "./controllers/get-auth-refresh.controller";
import { RefreshUseCase } from "./use-cases/refresh.use-case";

@Module({
  providers: [AuthenticateUseCase, RefreshUseCase],
  controllers: [
    GetAuthRefreshController,
    PostAuthLoginGoogleController,
    PostAuthLogoutController,
  ],
})
export class AuthModule {}
