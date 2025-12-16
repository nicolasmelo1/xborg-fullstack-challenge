import { teardown } from "@xborg/config/jest/jest-teardown";

export default async function globalTeardown(): Promise<void> {
  await teardown();
}
