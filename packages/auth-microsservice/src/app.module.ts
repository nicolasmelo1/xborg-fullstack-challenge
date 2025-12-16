import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProfileModule } from "./profiles/profile.module";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProfileModule,
    AuthModule,
  ],
})
export class AppModule {}
