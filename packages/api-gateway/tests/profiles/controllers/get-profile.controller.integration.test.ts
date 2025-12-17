import {
  INestApplication,
  Controller,
  INestMicroservice,
  ValidationPipe,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MessagePattern, Transport } from "@nestjs/microservices";
import { Test } from "@nestjs/testing";
import { EVENTS, GetEventOutput } from "@xborg/shared/backend";
import { MessagingModule } from "src/messaging.module";
import supertest from "supertest";
import { GetProfileController } from "src/profiles/controllers/get-profile.controller";
import { GetProfileUseCase } from "src/profiles/use-cases/get-profile.use-case";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller()
class MockedListener {
  @MessagePattern(EVENTS.user.read)
  async handle(): Promise<GetEventOutput<typeof EVENTS.user.read>> {
    return {} as GetEventOutput<typeof EVENTS.user.read>;
  }
}

describe("GetProfileController (integration)", () => {
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
      controllers: [GetProfileController],
      providers: [GetProfileUseCase],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          const request = ctx.switchToHttp().getRequest();
          const externalId = request.headers["x-external-id"];
          if (!externalId)
            throw new UnauthorizedException("Missing external id");
          request.user = {
            sub: externalId,
          };
          return true;
        },
      })
      .compile();

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

  it("should return a 200 status code removing all extraneous values", async () => {
    const expectedResponse: GetEventOutput<typeof EVENTS.user.read> = {
      success: true,
      user: {
        id: 123,
        email: "test@test.com",
        externalId: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
        googleId: "123",
        firstName: "test",
        lastName: "test",
        picture: "test",
      },
    };
    handleSpy.mockResolvedValue(expectedResponse);

    const response = await supertest(app.getHttpServer())
      .get("/user/profile")
      .set("x-external-id", "123");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      externalId: expectedResponse.user.externalId,
      email: expectedResponse.user.email,
      firstName: expectedResponse.user.firstName,
      lastName: expectedResponse.user.lastName,
      picture: expectedResponse.user.picture,
      createdAt: expectedResponse.user.createdAt.toISOString(),
      updatedAt: expectedResponse.user.updatedAt.toISOString(),
    });
  });

  it("should fail with 404 when the service fails", async () => {
    const expectedResponse: GetEventOutput<typeof EVENTS.user.read> = {
      success: false,
      error: "Error",
    };
    handleSpy.mockResolvedValue(expectedResponse);

    const response = await supertest(app.getHttpServer())
      .get("/user/profile")
      .set("x-external-id", "123");

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      message: "Error",
      statusCode: 404,
    });
  });

  it("should return a 401 when the user is not authenticated", async () => {
    const response = await supertest(app.getHttpServer()).get("/user/profile");

    expect(response.status).toEqual(401);
  });
});
