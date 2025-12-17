import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Profile from "../src/app/(authenticated)/profile/page";
import { useRouterMock } from "./testUtils";
import { api } from "../src/api";
import { Mock } from "vitest";

const setProfileMock = vi.fn();
const mockedProfile = {
  externalId: "123",
  email: "a@test.com",
  firstName: "Nicolas",
  lastName: "Melo",
  picture: null,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

vi.mock("../src/hooks/use-profile", () => ({
  __esModule: true,
  default: () => mockedProfile,
}));

vi.mock("../src/hooks/use-set-profile", () => ({
  __esModule: true,
  default: () => setProfileMock,
}));

vi.mock("../src/api", () => ({
  api: {
    logout: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

test("Profile page logs out and redirects to signin", async () => {
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

test("Profile page updates profile context after successful save", async () => {
  useRouterMock.mockReturnValue({
    push: vi.fn(),
  });
  (api.updateProfile as Mock).mockResolvedValue(true);

  render(<Profile />);

  fireEvent.change(screen.getByLabelText("First name"), {
    target: { value: "Newname" },
  });

  fireEvent.click(screen.getByText("Save changes"));

  await waitFor(() => expect(api.updateProfile).toHaveBeenCalled());
  await waitFor(() => expect(setProfileMock).toHaveBeenCalled());

  expect(setProfileMock).toHaveBeenCalledWith(
    expect.objectContaining({
      firstName: "Newname",
      updatedAt: expect.any(String),
    }),
  );
});
