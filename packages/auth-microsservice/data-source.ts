import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { join } from "path";
import * as dotenv from "dotenv";

dotenv.config();

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, "**/*.entity.ts")],
  migrations: [join(__dirname, "migrations/*.{ts,js}")],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: false,
});
