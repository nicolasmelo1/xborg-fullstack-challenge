import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import UnProtectedLayout from "../src/app/(unauthenticated)/layout";
import { setMockCookies } from "./testUtils";
import { server, http, HttpResponse } from "./mocks/server";
import { COOKIE_REFRESH_TOKEN, COOKIE_SESSION } from "@xborg/shared/all";

test("Unauthenticated layout renders children when no cookies", async () => {
  setMockCookies({});
  const ui = await UnProtectedLayout({ children: <div>Guest</div> });
  render(ui as React.ReactElement);
  expect(screen.getByText("Guest")).toBeInTheDocument();
});

test("Unauthenticated layout redirects to profile when already authenticated", async () => {
  setMockCookies({
    [COOKIE_SESSION]: "s",
    [COOKIE_REFRESH_TOKEN]: "r",
  });
  server.use(
    http.get("http://localhost:3006/user/profile", () =>
      HttpResponse.json({ statusCode: 200 }),
    ),
  );
  await expect(
    UnProtectedLayout({ children: <div>Guest</div> }),
  ).rejects.toMatchObject({
    message: expect.stringContaining("REDIRECT:/profile"),
  });
});
