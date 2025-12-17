import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { COOKIE_REFRESH_TOKEN, COOKIE_SESSION } from "@xborg/shared/all";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const swaggerEnabled =
    process.env.SWAGGER_ENABLED === "true" ||
    (process.env.SWAGGER_ENABLED !== "false" &&
      process.env.NODE_ENV !== "production");

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("XBorg API Gateway")
      .setDescription(
        "HTTP API for Google OAuth login and user profile management.",
      )
      .setVersion("1.0")
      .addCookieAuth(
        COOKIE_SESSION,
        {
          type: "apiKey",
          in: "cookie",
          name: COOKIE_SESSION,
        },
        "session",
      )
      .addCookieAuth(
        COOKIE_REFRESH_TOKEN,
        {
          type: "apiKey",
          in: "cookie",
          name: COOKIE_REFRESH_TOKEN,
        },
        "refreshToken",
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
