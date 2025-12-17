import { render, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import SignInCallback from "../src/app/(unauthenticated)/signin/callback/page";
import { useRouterMock, useSearchParamsMock } from "./testUtils";

test("SignInCallback posts success message and closes window", async () => {
  useRouterMock.mockReturnValue({
    push: vi.fn(),
  });
  useSearchParamsMock.mockReturnValue(new URLSearchParams(""));

  window.history.pushState({}, "", "/signin/callback");

  const postMessage = vi.fn();
  Object.defineProperty(window, "opener", {
    value: { postMessage },
    configurable: true,
  });
  const close = vi.spyOn(window, "close").mockImplementation(() => undefined);

  render(<SignInCallback />);

  await waitFor(() =>
    expect(postMessage).toHaveBeenCalledWith(
      { type: "oauth:google:success" },
      window.location.origin,
    ),
  );
  expect(close).toHaveBeenCalled();
  close.mockRestore();
});

test("SignInCallback posts error message and closes window", async () => {
  useRouterMock.mockReturnValue({
    push: vi.fn(),
  });
  useSearchParamsMock.mockReturnValue(new URLSearchParams(""));

  window.history.pushState({}, "", "/signin/callback?error=bad");

  const postMessage = vi.fn();
  Object.defineProperty(window, "opener", {
    value: { postMessage },
    configurable: true,
  });
  const close = vi.spyOn(window, "close").mockImplementation(() => undefined);

  render(<SignInCallback />);

  await waitFor(() =>
    expect(postMessage).toHaveBeenCalledWith(
      { type: "oauth:google:error", error: "bad" },
      window.location.origin,
    ),
  );
  expect(close).toHaveBeenCalled();
  close.mockRestore();
});
