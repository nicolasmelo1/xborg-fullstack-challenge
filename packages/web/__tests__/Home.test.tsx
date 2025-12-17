import { expect, test } from "vitest";
import Home from "../src/app/page";
import { setMockCookies } from "./testUtils";
import { server, http, HttpResponse } from "./mocks/server";
import { COOKIE_SESSION, COOKIE_REFRESH_TOKEN } from "@xborg/shared/all";

test("Home redirects to signin when no cookies", async () => {
  setMockCookies({});

  await expect(Home()).rejects.toMatchObject({
    message: expect.stringContaining("REDIRECT:/signin"),
  });
});

test("Home redirects to profile when cookies and profile is available", async () => {
  setMockCookies({
    [COOKIE_SESSION]: "s",
    [COOKIE_REFRESH_TOKEN]: "r",
  });
  server.use(
    http.get("http://localhost:3000/api/user/profile", () =>
      HttpResponse.json({ statusCode: 200 }),
    ),
  );

  await expect(Home()).rejects.toMatchObject({
    message: expect.stringContaining("REDIRECT:/profile"),
  });
});
