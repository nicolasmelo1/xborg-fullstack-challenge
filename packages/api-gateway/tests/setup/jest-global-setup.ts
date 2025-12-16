import { setup } from "@xborg/config/jest/jest-setup";
import { config } from "dotenv";

config({ override: true, path: `.env.${process.env.NODE_ENV}` });

export default async function globalSetup(): Promise<void> {
  await setup(["redis"]);
}
