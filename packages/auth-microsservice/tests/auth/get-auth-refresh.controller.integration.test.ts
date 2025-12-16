import {
  INestApplication,
  INestMicroservice,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "src/database.module";
import { UserEntity } from "src/profiles/entities/user.entity";
import { PROFILE_REPOSITORY } from "src/profiles/profile.contants";
import { ProfileRepository } from "src/profiles/profile.repository";
import { ReadProfileByExternalIdUseCase } from "src/profiles/use-cases/read-profile-by-external-id.use-case";
import { EVENTS } from "@xborg/shared/backend";
import { GetAuthRefreshController } from "src/auth/controllers/get-auth-refresh.controller";
import { RefreshUseCase } from "src/auth/use-cases/refresh.use-case";
import { SignTokenUseCase } from "src/auth/use-cases/sign-token.use-case";

describe("GetAuthRefreshController (integration)", () => {
  let app: INestApplication;
  let microservice: INestMicroservice;
  let repository: ProfileRepository;
  let client: ClientProxy;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule.forTest(),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      controllers: [GetAuthRefreshController],
      providers: [
        RefreshUseCase,
        ReadProfileByExternalIdUseCase,
        SignTokenUseCase,
        {
          provide: PROFILE_REPOSITORY,
          useClass: ProfileRepository,
        },
      ],
    }).compile();

    const configService = moduleRef.get(ConfigService);

    client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: configService.get("REDIS_HOST"),
        port: Number(configService.get("REDIS_PORT")),
      },
    });

    microservice = moduleRef.createNestMicroservice({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    repository = app.get(PROFILE_REPOSITORY);

    await Promise.all([microservice.listen(), client.connect()]);
  });

  afterEach(async () => {
    await Promise.all([microservice.close(), client.close()]);
  });

  it("should return the refresh token from the externalId", async () => {
    const googleId = crypto.randomUUID();
    const externalId = crypto.randomUUID();
    const user: Parameters<ProfileRepository["create"]>[0] = {
      googleId: googleId,
      externalId: externalId,
      createdAt: new Date(),
      email: `test+${crypto.randomUUID()}@test.com`,
      firstName: "test",
      lastName: "test",
      picture: "test",
      updatedAt: new Date(),
    };
    await repository.create(user);

    const result = await lastValueFrom(
      client.send(EVENTS.auth.refresh, externalId),
    );

    expect(result.success).toBe(true);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it("should fail to return the refresh token when the externalId does not exist", async () => {
    const externalId = crypto.randomUUID();

    const result = await lastValueFrom(
      client.send(EVENTS.auth.refresh, externalId),
    );

    expect(result.success).toBe(false);
    expect(result.error).toEqual("No user found");
  });
});
