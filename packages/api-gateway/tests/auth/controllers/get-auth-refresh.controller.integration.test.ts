import {
  INestApplication,
  Controller,
  INestMicroservice,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MessagePattern, Transport } from "@nestjs/microservices";
import { Test } from "@nestjs/testing";
import { EVENTS, GetEventOutput } from "@xborg/shared/backend";
import { GetAuthRefreshController } from "src/auth/controllers/get-auth-refresh.controller";
import jwt from "jsonwebtoken";
import { RefreshUseCase } from "src/auth/use-cases/refresh.use-case";
import { MessagingModule } from "src/messaging.module";
import supertest from "supertest";

@Controller()
class MockedListener {
  @MessagePattern(EVENTS.auth.refresh)
  async handle(): Promise<GetEventOutput<typeof EVENTS.auth.refresh>> {
    return { success: true } as GetEventOutput<typeof EVENTS.auth.refresh>;
  }
}

describe("GetAuthRefreshController (integration)", () => {
  let app: INestApplication;
  let microservice: INestMicroservice;
  let handleSpy: jest.SpyInstance;
  let configService: ConfigService;

  beforeEach(async () => {
    const msModuleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [MockedListener],
    }).compile();
    const listener = msModuleRef.get<MockedListener>(MockedListener);
    handleSpy = jest.spyOn(listener, "handle");

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MessagingModule.forTest(),
      ],
      controllers: [GetAuthRefreshController],
      providers: [RefreshUseCase],
    }).compile();

    microservice = msModuleRef.createNestMicroservice({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
    app = moduleRef.createNestApplication();

    configService = app.get(ConfigService);
    await Promise.all([app.init(), microservice.listen()]);
  });

  afterEach(async () => {
    await Promise.all([app.close(), microservice.close()]);
  });

  it("should return a 200 status code when we have a valid refresh token cookie", async () => {
    const token = jwt.sign(
      {
        sub: "123",
        email: "test@test.com",
      },
      configService.get<string>("JWT_PRIVATE_KEY")!,
      {
        expiresIn: "1h",
      },
    );
    const expectedResponse = {
      success: true,
      accessToken: "testAccess",
      refreshToken: "testRefresh",
    };
    handleSpy.mockResolvedValue(expectedResponse);

    const response = await supertest(app.getHttpServer())
      .get("/auth/refresh")
      .set("cookie", `refreshToken=${token}`);

    expect(response.status).toEqual(200);
    expect(handleSpy).toHaveBeenCalled();
    expect(handleSpy).toHaveBeenCalledWith("123");
    expect(response.header["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining(`session=${expectedResponse.accessToken}`),
        expect.stringContaining(
          `refreshToken=${expectedResponse.refreshToken}`,
        ),
      ]),
    );
  });

  it("should return a 401 status code when we have an invalid refresh token cookie", async () => {
    const token = jwt.sign(
      {
        sub: "123",
        email: "test@test.com",
      },
      "invalid-private-key",
      {
        expiresIn: "1h",
      },
    );

    const response = await supertest(app.getHttpServer())
      .get("/auth/refresh")
      .set("cookie", `refreshToken=${token}`);

    expect(response.status).toEqual(401);
  });

  it("should return a 401 status code when we have no refresh token cookie", async () => {
    const response = await supertest(app.getHttpServer()).get("/auth/refresh");

    expect(response.status).toEqual(401);
  });

  it("should return a 401 if we just have the session cookie", async () => {
    const sessionToken = jwt.sign(
      {
        sub: "123",
        email: "test@test.com",
      },
      configService.get<string>("JWT_PRIVATE_KEY")!,
      {
        expiresIn: "1h",
      },
    );
    const response = await supertest(app.getHttpServer())
      .get("/auth/refresh")
      .set("cookie", `session=${sessionToken}`);

    expect(response.status).toEqual(401);
  });
});
