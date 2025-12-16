import { INestApplication } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import jwt from "jsonwebtoken";
import { MessagingModule } from "src/messaging.module";
import supertest from "supertest";
import { PostAuthLogoutController } from "src/auth/controllers/post-auth-logout.controller";

describe("PostAuthLogoutController (integration)", () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MessagingModule.forTest(),
      ],
      controllers: [PostAuthLogoutController],
    }).compile();

    app = moduleRef.createNestApplication();
    configService = app.get(ConfigService);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("should logout the user when we have a valid session token cookie", async () => {
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

    const response = await supertest(app.getHttpServer())
      .post("/auth/logout")
      .set("cookie", `session=${token}`);

    expect(response.header["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining(`session=`),
        expect.stringContaining(`refreshToken=`),
      ]),
    );
  });

  it("should not logout the user when we have an invalid session token cookie", async () => {
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
      .post("/auth/logout")
      .set("cookie", `session=${token}`);

    expect(response.status).toEqual(401);
  });

  it("should not logout the user when just have the refresh token cookie", async () => {
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

    const response = await supertest(app.getHttpServer())
      .post("/auth/logout")
      .set("cookie", `refreshToken=${token}`);

    expect(response.status).toEqual(401);
  });
});
