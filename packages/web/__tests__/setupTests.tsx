import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { server, defaultHandlers } from "./mocks/server";
import {
  cookieStore,
  redirectMock,
  setMockCookies,
  usePathnameMock,
  useRouterMock,
  useSearchParamsMock,
} from "./testUtils";

process.env.NEXT_PUBLIC_API_HOST ??= "http://localhost:3006";

vi.mock("next/navigation", () => ({
  useRouter: useRouterMock,
  useSearchParams: useSearchParamsMock,
  usePathname: usePathnameMock,
  redirect: redirectMock,
}));

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: (name: string) =>
      cookieStore[name] ? { value: cookieStore[name] } : undefined,
    toString: () =>
      Object.entries(cookieStore)
        .map(([key, value]) => `${key}=${value}`)
        .join("; "),
  }),
}));

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers(...defaultHandlers);
  cleanup();
  setMockCookies({});
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});
