import { GenericContainer } from "testcontainers";

async function createTestRedis(): Promise<void> {
  const container = await new GenericContainer("redis:8-alpine")
    .withExposedPorts(6379)
    .start();

  process.env.REDIS_HOST = container.getHost();
  process.env.REDIS_PORT = container.getMappedPort(6379).toString();
  (globalThis as any).redisContainer = container;
}

async function createTestDb(): Promise<void> {
  const container = await new GenericContainer("postgres:18-alpine")
    .withExposedPorts(5432)
    .start();

  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = container.getMappedPort(5432).toString();
  process.env.DB_USER = "postgres";
  process.env.DB_PASSWORD = "password";
  process.env.DB_NAME = "postgres";

  (globalThis as any).dbContainer = container;
}

export async function setup(
  toSetup: ("redis" | "db")[] = ["redis", "db"],
): Promise<void> {
  const promises: Promise<void>[] = [];

  if (toSetup.includes("redis")) promises.push(createTestRedis());
  if (toSetup.includes("db")) promises.push(createTestDb());

  await Promise.all(promises);
}
