import "reflect-metadata";
import { setup } from "@xborg/config/jest/jest-setup";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { join } from "path";
import { config } from "dotenv";

config({ override: true, path: `.env.${process.env.NODE_ENV}` });

async function runMigrations() {
  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [join(__dirname, "..", "..", "**/*.entity.ts")],
    migrations: [join(__dirname, "..", "..", "migrations/*.{ts,js}")],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    logging: false,
  });
  await dataSource.initialize();

  const migrations = await dataSource.showMigrations();

  if (migrations) {
    const migrationsResult = await dataSource.runMigrations();
    console.log(
      "Migrations applied:",
      migrationsResult.map((m) => m.name),
    );
    console.log("Migrations completed");
  } else {
    console.log("No migrations to run");
  }

  console.log("Destroying data source");
  await dataSource.destroy();
}

export default async function globalSetup(): Promise<void> {
  await setup(["redis", "db"]);
  // await runMigrations();
}
