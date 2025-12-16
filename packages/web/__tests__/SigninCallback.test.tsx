import { render, waitFor } from "@testing-library/react";
import { expect, test, vi, Mock } from "vitest";
import SignInCallback from "../src/app/(unauthenticated)/signin/callback/page";
import { useRouterMock, useSearchParamsMock } from "./testUtils";
import { api } from "../src/api";

vi.mock("../src/api", () => ({
  api: {
    login: vi.fn(),
  },
}));

test("SignInCallback redirects to profile when login succeeds", async () => {
  const push = vi.fn();
  useRouterMock.mockReturnValue({
    push,
  });
  useSearchParamsMock.mockReturnValue(new URLSearchParams("code=abc"));
  (api.login as Mock).mockResolvedValue(true);

  render(<SignInCallback />);

  await waitFor(() => expect(push).toHaveBeenCalledWith("/profile"));
});

test("SignInCallback redirects to signin with error when code is missing", async () => {
  const push = vi.fn();
  useRouterMock.mockReturnValue({
    push,
  });
  useSearchParamsMock.mockReturnValue(new URLSearchParams(""));

  render(<SignInCallback />);

  await waitFor(() =>
    expect(push).toHaveBeenCalledWith(expect.stringContaining("/signin?")),
  );
});
