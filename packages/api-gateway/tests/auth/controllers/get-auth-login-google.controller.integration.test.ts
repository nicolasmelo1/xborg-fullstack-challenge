import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { GetAuthLoginGoogleController } from "src/auth/controllers/get-auth-login-google.controller";
import { BuildGoogleUrlUseCase } from "src/auth/use-cases/build-google-url.use-case";
import { GOOGLE_OUATH_CLIENT } from "src/google-oauth.module";
import { REDIRECT_URL_COOKIE } from "src/auth/auth.constants";

describe("GetAuthLoginGoogleController (integration)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [GetAuthLoginGoogleController],
      providers: [
        BuildGoogleUrlUseCase,
        {
          provide: GOOGLE_OUATH_CLIENT,
          useValue: {
            generateAuthUrl: () => "https://test.com",
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("should return a 302 status and redirect to the google login page", async () => {
    const response = await supertest(app.getHttpServer())
      .get("/auth/login/google")
      .query({
        redirectUrl: "https://test.com",
      });

    expect(response.status).toEqual(302);
    expect(response.headers.location).toEqual("https://test.com");
    expect(response.header["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          `${REDIRECT_URL_COOKIE}=https%3A%2F%2Ftest.com`,
        ),
      ]),
    );
  });
});
