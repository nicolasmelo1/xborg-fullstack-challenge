export async function teardown(): Promise<void> {
  await Promise.all([
    (globalThis as any)?.redisContainer?.stop() || Promise.resolve(),
    (globalThis as any)?.dbContainer?.stop() || Promise.resolve(),
  ]);
}
