import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import ProtectedLayout from "../src/app/(authenticated)/layout";
import { setMockCookies } from "./testUtils";
import { server, http, HttpResponse } from "./mocks/server";
import { COOKIE_REFRESH_TOKEN, COOKIE_SESSION } from "@xborg/shared/all";
import { JSX } from "react";

test("Authenticated layout redirects to signin without cookies", async () => {
  setMockCookies({});
  await expect(
    ProtectedLayout({ children: <div>Private</div> }),
  ).rejects.toMatchObject({
    message: expect.stringContaining("REDIRECT:/signin"),
  });
});

test("Authenticated layout redirects to signin when profile is unauthorized", async () => {
  setMockCookies({
    [COOKIE_SESSION]: "s",
    [COOKIE_REFRESH_TOKEN]: "r",
  });
  await expect(
    ProtectedLayout({ children: <div>Private</div> }),
  ).rejects.toMatchObject({
    message: expect.stringContaining("REDIRECT:/signin"),
  });
});

test("Authenticated layout renders children when profile is available", async () => {
  setMockCookies({
    [COOKIE_SESSION]: "s",
    [COOKIE_REFRESH_TOKEN]: "r",
  });
  server.use(
    http.get("http://localhost:3000/api/user/profile", () =>
      HttpResponse.json({
        externalId: "1",
        email: "a@test.com",
        firstName: "Nicolas",
        lastName: "Sanchez",
        picture: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    ),
  );

  const ui = (await ProtectedLayout({
    children: <div>Private</div>,
  })) as JSX.Element;
  render(ui);

  expect(screen.getByText("Private")).toBeInTheDocument();
});
