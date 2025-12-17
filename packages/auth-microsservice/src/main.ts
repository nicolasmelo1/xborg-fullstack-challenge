import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),

        password: process.env.REDIS_PASSWORD ?? undefined,
        username: process.env.REDIS_USER ?? undefined,
      },
    },
  );
  await app.listen();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
