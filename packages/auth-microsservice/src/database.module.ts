import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: "postgres",
          host: configService.get("DB_HOST"),
          port: configService.get("DB_PORT"),
          username: configService.get("DB_USER"),
          password: configService.get("DB_PASSWORD"),
          database: configService.get("DB_NAME"),
          namingStrategy: new SnakeNamingStrategy(),
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forTest(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            return {
              type: "postgres",
              host: configService.get("DB_HOST"),
              port: configService.get("DB_PORT"),
              username: configService.get("DB_USER"),
              password: configService.get("DB_PASSWORD"),
              database: configService.get("DB_NAME"),
              namingStrategy: new SnakeNamingStrategy(),
              autoLoadEntities: true,
              synchronize: true,
            };
          },
          inject: [ConfigService],
        }),
      ],
    };
  }
}
