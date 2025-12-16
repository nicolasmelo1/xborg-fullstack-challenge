import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import SignInPage from "../src/app/(unauthenticated)/signin/page";
import { useRouterMock, useSearchParamsMock } from "./testUtils";

test("SignInPage triggers google login and navigates to callback", () => {
  const push = vi.fn();
  useRouterMock.mockReturnValue({
    push,
  });
  useSearchParamsMock.mockReturnValue(new URLSearchParams(""));

  render(<SignInPage />);

  fireEvent.click(screen.getByText("Sign in with Google"));

  expect(push).toHaveBeenCalledWith(
    expect.stringContaining("/signin/callback?"),
  );
});
