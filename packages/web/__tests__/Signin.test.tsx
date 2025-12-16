import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import SignInPage from "../src/app/(unauthenticated)/signin/page";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(""),
}));

test("SignInPage", () => {
  render(<SignInPage />);
  expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
});
