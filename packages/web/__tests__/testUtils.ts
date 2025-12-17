import { MockedFunction, vi } from "vitest";

export const cookieStore: Record<string, string> = {};

export const setMockCookies = (cookies: Record<string, string>) => {
  Object.keys(cookieStore).forEach((key) => delete cookieStore[key]);
  Object.assign(cookieStore, cookies);
};

export const useRouterMock = vi.fn(
  () =>
    ({
      push: vi.fn(),
    }) as {
      push: MockedFunction<(url: string) => Promise<void>>;
    },
);

export const useSearchParamsMock = vi.fn(() => new URLSearchParams(""));
export const usePathnameMock = vi.fn(() => "/");

export const redirectMock = vi.fn((url: string) => {
  const error = new Error(`REDIRECT:${url}`);
  (error as unknown as { url: string }).url = url;
  throw error;
});
