import {
  INestApplication,
  Controller,
  INestMicroservice,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MessagePattern, Transport } from "@nestjs/microservices";
import { Test } from "@nestjs/testing";
import { EVENTS, GetEventOutput } from "@xborg/shared/backend";
import { MessagingModule } from "src/messaging.module";
import supertest from "supertest";
import { PostAuthLoginGoogleController } from "src/auth/controllers/post-auth-login-google.controller";
import { AuthenticateUseCase } from "src/auth/use-cases/authenticate.use-case";

@Controller()
class MockedListener {
  @MessagePattern(EVENTS.auth.authenticate)
  async handle(): Promise<GetEventOutput<typeof EVENTS.auth.authenticate>> {
    return { success: true } as GetEventOutput<typeof EVENTS.auth.authenticate>;
  }
}

describe("PostAuthLoginGoogleController (integration)", () => {
  let app: INestApplication;
  let microservice: INestMicroservice;
  let handleSpy: jest.SpyInstance;

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
      controllers: [PostAuthLoginGoogleController],
      providers: [AuthenticateUseCase],
    }).compile();

    microservice = msModuleRef.createNestMicroservice({
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

    await Promise.all([app.init(), microservice.listen()]);
  });

  afterEach(async () => {
    await Promise.all([app.close(), microservice.close()]);
  });

  it("should return a 201 status code when everything is ok", async () => {
    const payload = {
      code: "123",
    };
    const expectedResponse = {
      success: true,
      accessToken: "testAccess",
      refreshToken: "testRefresh",
    };
    handleSpy.mockResolvedValue(expectedResponse);

    const response = await supertest(app.getHttpServer())
      .post("/auth/login/google")
      .send(payload);

    expect(response.status).toEqual(201);
    expect(handleSpy).toHaveBeenCalled();
    expect(handleSpy).toHaveBeenCalledWith(payload);
    expect(response.header["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining(`session=${expectedResponse.accessToken}`),
        expect.stringContaining(
          `refreshToken=${expectedResponse.refreshToken}`,
        ),
      ]),
    );
  });

  it("should return a 400 status code when the code is not provided", async () => {
    const payload = {};

    const response = await supertest(app.getHttpServer())
      .post("/auth/login/google")
      .send(payload);

    expect(response.status).toEqual(400);
  });
});
