import { setup } from "@xborg/config/jest/jest-setup";

export default async function globalSetup(): Promise<void> {
  await setup(["redis"]);
}
