import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const defaultHandlers = [
  http.get("http://localhost:3000/api/user/profile", () =>
    HttpResponse.json({ statusCode: 401 }),
  ),
  http.get("http://localhost:3000/api/auth/refresh", () =>
    HttpResponse.json({ statusCode: 401 }, { status: 401 }),
  ),
  http.post("http://localhost:3000/api/auth/login/google", () =>
    HttpResponse.json({}, { status: 200 }),
  ),
  http.post("http://localhost:3000/api/auth/logout", () =>
    HttpResponse.json({}, { status: 200 }),
  ),
];

export const server = setupServer(...defaultHandlers);
export { http, HttpResponse };
