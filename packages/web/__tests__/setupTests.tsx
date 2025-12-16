import "@testing-library/jest-dom/vitest";
import React from "react";
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

vi.mock("@react-oauth/google", () => ({
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useGoogleLogin:
    (options: { onSuccess?: (data: { code: string }) => void }) => () => {
      options?.onSuccess?.({ code: "CODE" });
    },
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
