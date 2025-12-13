import { Module } from "@nestjs/common";
import { PostAuthLoginGoogleController } from "./controllers/post-auth-login-google.controller";

@Module({
  controllers: [PostAuthLoginGoogleController],
})
export class AuthModule {}
