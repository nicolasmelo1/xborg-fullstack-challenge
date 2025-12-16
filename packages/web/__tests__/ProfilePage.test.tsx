import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Profile from "../src/app/(authenticated)/profile/page";
import { useRouterMock } from "./testUtils";
import { api } from "../src/api";
import { Mock } from "vitest";

vi.mock("../src/api", () => ({
  api: {
    logout: vi.fn(),
  },
}));

test("Profile page logs out and redirects to signin", async () => {
  vi.mock("../src/hooks/use-profile", () => ({
    __esModule: true,
    default: () => ({
      externalId: "123",
      email: "a@test.com",
      firstName: "Nicolas",
      lastName: "Melo",
      picture: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  }));
  const push = vi.fn();
  useRouterMock.mockReturnValue({
    push,
  });
  (api.logout as Mock).mockResolvedValue(true);

  render(<Profile />);

  fireEvent.click(screen.getByText("Logout"));

  await waitFor(() => expect(api.logout).toHaveBeenCalled());
  expect(push).toHaveBeenCalledWith("/signin");
});
