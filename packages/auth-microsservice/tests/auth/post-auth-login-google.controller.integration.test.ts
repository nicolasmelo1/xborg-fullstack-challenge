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
import { EVENTS } from "@xborg/shared/backend";
import { SignTokenUseCase } from "src/auth/use-cases/sign-token.use-case";
import { PostAuthLoginGoogleController } from "src/auth/controllers/post-auth-login-google.controller";
import { AuthenticateUseCase } from "src/auth/use-cases/authenticate.use-case";
import { ReadProfileByGoogleIdUseCase } from "src/profiles/use-cases/read-profile-by-google-id.use-case";
import { GOOGLE_OUATH_CLIENT } from "src/google-oauth.module";
import { CreateProfileUseCase } from "src/profiles/use-cases/create-profile.use-case";
import { LoginTicket } from "google-auth-library";
import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";

describe("GetAuthRefreshController (integration)", () => {
  let app: INestApplication;
  let microservice: INestMicroservice;
  let repository: ProfileRepository;
  let client: ClientProxy;
  const googleClient = {
    getToken: jest.fn(),
    verifyIdToken: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule.forTest(),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      controllers: [PostAuthLoginGoogleController],
      providers: [
        AuthenticateUseCase,
        ReadProfileByGoogleIdUseCase,
        CreateProfileUseCase,
        {
          provide: GOOGLE_OUATH_CLIENT,
          useValue: googleClient,
        },
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

  it("should return the access and refresh token and create the user if the auth flow is successful and user does not exist", async () => {
    const code = crypto.randomUUID();
    const googleProfilePayload = {
      sub: crypto.randomUUID(),
      email: `test+${crypto.randomUUID()}@test.com`,
      given_name: "admin",
      family_name: "test",
      picture: "https://test.com/test.png",
    };
    googleClient.getToken.mockResolvedValue({
      tokens: {
        id_token: crypto.randomUUID(),
      },
    } as Pick<GetTokenResponse, "tokens">);
    googleClient.verifyIdToken.mockResolvedValue({
      getPayload: () => googleProfilePayload,
    } as Pick<LoginTicket, "getPayload">);

    const result = await lastValueFrom(
      client.send(EVENTS.auth.authenticate, {
        code,
      }),
    );
    const user = await repository.getByGoogleId(googleProfilePayload.sub);

    expect(result.success).toBe(true);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(user).toBeDefined();
    expect(user?.googleId).toEqual(googleProfilePayload.sub);
    expect(user?.email).toEqual(googleProfilePayload.email);
    expect(user?.firstName).toEqual(googleProfilePayload.given_name);
    expect(user?.lastName).toEqual(googleProfilePayload.family_name);
    expect(user?.picture).toEqual(googleProfilePayload.picture);
  });

  it("should return the access and refresh token and update the user if the auth flow is successful and user already exists", async () => {
    const googleId = crypto.randomUUID();
    const externalId = crypto.randomUUID();
    const googleProfilePayload = {
      sub: googleId,
      email: `test+${crypto.randomUUID()}@test.com`,
      given_name: "admin",
      family_name: "test",
      picture: "https://test.com/test.png",
    };
    const userToCreate: Parameters<ProfileRepository["create"]>[0] = {
      googleId: googleId,
      externalId: externalId,
      createdAt: new Date(),
      email: googleProfilePayload.email,
      firstName: googleProfilePayload.given_name,
      lastName: googleProfilePayload.family_name,
      picture: googleProfilePayload.picture,
      updatedAt: new Date(),
    };
    googleClient.getToken.mockResolvedValue({
      tokens: {
        id_token: crypto.randomUUID().toString(),
      },
    } as Pick<GetTokenResponse, "tokens">);
    googleClient.verifyIdToken.mockResolvedValue({
      getPayload: () => googleProfilePayload,
    } as Pick<LoginTicket, "getPayload">);
    await repository.create(userToCreate);

    const result = await lastValueFrom(
      client.send(EVENTS.auth.authenticate, {
        code: crypto.randomUUID(),
      }),
    );
    const user = await repository.getByGoogleId(googleProfilePayload.sub);

    expect(result.success).toBe(true);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(user).toBeDefined();
    expect(user?.googleId).toEqual(userToCreate.googleId);
    expect(user?.externalId).toEqual(userToCreate.externalId);
    expect(user?.email).toEqual(userToCreate.email);
    expect(user?.firstName).toEqual(userToCreate.firstName);
    expect(user?.lastName).toEqual(userToCreate.lastName);
    expect(user?.createdAt).toEqual(userToCreate.createdAt);
    expect(user?.updatedAt).toEqual(userToCreate.updatedAt);
  });

  it("should fail to return the access and refresh token when the auth flow is unsuccessful", async () => {
    googleClient.getToken.mockResolvedValue({
      tokens: {
        id_token: crypto.randomUUID().toString(),
      },
    } as Pick<GetTokenResponse, "tokens">);
    googleClient.verifyIdToken.mockResolvedValue({
      getPayload: () => undefined,
    } as Pick<LoginTicket, "getPayload">);

    const result = await lastValueFrom(
      client.send(EVENTS.auth.authenticate, {
        code: crypto.randomUUID(),
      }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toEqual("Invalid token");
  });

  it("should fail to return the access and refresh token when no code is provided", async () => {
    const result = await lastValueFrom(
      client.send(EVENTS.auth.authenticate, {}),
    );

    expect(result.success).toBe(false);
    expect(result.error).toEqual("No code");
  });

  it("should fail to return the access and refresh token when no id_token exists", async () => {
    googleClient.getToken.mockResolvedValue({
      tokens: {
        id_token: undefined,
      },
    } as Pick<GetTokenResponse, "tokens">);
    const result = await lastValueFrom(
      client.send(EVENTS.auth.authenticate, {
        code: crypto.randomUUID(),
      }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toEqual("No id_token");
  });
});
