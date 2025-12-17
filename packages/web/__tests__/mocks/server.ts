import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const defaultHandlers = [
  http.get("http://localhost:3006/user/profile", () =>
    HttpResponse.json({ statusCode: 401 }),
  ),
  http.get("http://localhost:3006/auth/refresh", () =>
    HttpResponse.json({ statusCode: 401 }, { status: 401 }),
  ),
  http.post("http://localhost:3006/auth/login/google", () =>
    HttpResponse.json({}, { status: 200 }),
  ),
  http.post("http://localhost:3006/auth/logout", () =>
    HttpResponse.json({}, { status: 200 }),
  ),
];

export const server = setupServer(...defaultHandlers);
export { http, HttpResponse };
