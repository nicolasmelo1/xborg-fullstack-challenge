import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MessagingModule } from "./messaging.module.js";
import { ProfileModule } from "./profiles/profile.module.js";
import { AuthModule } from "./auth/auth.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MessagingModule,
    ProfileModule,
    AuthModule,
  ],
})
export class AppModule {}
