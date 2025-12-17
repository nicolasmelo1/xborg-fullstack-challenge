import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import SignInPage from "../src/app/(unauthenticated)/signin/(redirect-to-app)/page";
import { useRouterMock, useSearchParamsMock } from "./testUtils";

test("SignInPage triggers google login (popup)", () => {
  useRouterMock.mockReturnValue({
    push: vi.fn(),
  });
  useSearchParamsMock.mockReturnValue(new URLSearchParams(""));

  const open = vi.fn(() => ({} as Window));
  vi.stubGlobal("open", open);

  render(<SignInPage />);

  fireEvent.click(screen.getByText("Sign in with Google"));

  expect(open).toHaveBeenCalledWith(
    expect.stringContaining("/auth/login/google"),
    "google_oauth",
    expect.stringContaining("width="),
  );
});
