import { setup } from "@xborg/config/tests/setup";

export default async function globalSetup(): Promise<void> {
  await setup();
}
