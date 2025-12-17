import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

export const AUTH_SERVICE_CLIENT = Symbol("AUTH_SERVICE_CLIENT");

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: config.get("REDIS_HOST"),
            port: config.get("REDIS_PORT"),
            password: config.get("REDIS_PASSWORD") ?? undefined,
            username: config.get("REDIS_USER") ?? undefined,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MessagingModule {
  static forTest(): DynamicModule {
    return {
      module: MessagingModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: AUTH_SERVICE_CLIENT,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              transport: Transport.REDIS,
              options: {
                host: config.get("REDIS_HOST"),
                port: config.get("REDIS_PORT"),
              },
            }),
          },
        ]),
      ],
    };
  }
}
