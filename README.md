# xborg-fullstack-challenge

Full Stack Engineer technical challenge (monorepo).

## Prerequisites

### Google Client ID and Secret

- Get your Google Client ID and Secret from [Google Cloud Console](https://console.cloud.google.com/)
- Create a new OAuth 2.0 Client
- Add `http://localhost:3000` as an authorized JavaScript origin
- Add `http://localhost:3000/api/auth/validate/google` as an authorized redirect URI

For production, add your deployed web URL:

- Authorized JavaScript origin: `https://<your-vercel-app>.vercel.app`
- Authorized redirect URI: `https://<your-vercel-app>.vercel.app/api/auth/validate/google`

## Running locally

1. Use the Node.js version from `.nvmrc`:

```bash
nvm use
```

2. Install dependencies:

```bash
pnpm install
```

3. Copy all `.env.example` files to `.env` (without overwriting existing `.env` files):

```bash
find packages -name ".env.example" -exec sh -c 'cp -n "$1" "${1%.example}"' _ {} \\;
```

4. Start local infrastructure (Postgres + Redis):

```bash
pnpm run up
```

5. Run database migrations:

```bash
pnpm run migration:run
```

6. Start the dev servers:

```bash
pnpm run dev
```

## Tech stack

- TypeScript, Node.js
- PNPM workspaces + Turborepo
- Frontend: Next.js (App Router) + Tailwind CSS
- Backend: NestJS (HTTP gateway + microservice)
- Auth: Google OAuth2 + JWT (HTTP-only cookies)
- Database: Postgres + TypeORM
- Messaging: `@nestjs/microservices` over Redis transport

## Packages

- `packages/web`: Next.js frontend (signin + profile form).
- `packages/api-gateway`: NestJS HTTP API gateway (controllers, CORS, cookie sessions); communicates with auth via Redis.
- `packages/auth-microsservice`: NestJS microservice (Redis transport) + TypeORM/Postgres; exchanges Google code, verifies token, persists profile, signs JWTs.
- `packages/shared`: Shared types and backend event contracts used by both backend services and the web.
- `packages/config`: Shared TypeScript + ESLint configuration for the monorepo.

## Default URLs (local)

- Web: `http://localhost:3000`
- API Gateway: `http://localhost:3006`

## Auth endpoints

- `GET /auth/login/google` (public): starts Google OAuth.
- `GET /auth/validate/google` (public): Google callback; sets session cookies; redirects to the web app.

## API docs (Swagger)

API Gateway exposes Swagger UI at `http://localhost:3006/docs`.

- Enabled by default when `NODE_ENV` is not `production`.
- To enable in production, set `SWAGGER_ENABLED=true` on the API Gateway environment.

You can go to `https://xborg-fullstack-challenge-web.vercel.app/api/docs` to see the production API documentation

## Quality checks

From the repo root:

```bash
pnpm run lint
pnpm run test
```

If you want to run the checks just for the backend:

```bash
pnpm run test:backend

```

Web app only:

```bash
pnpm -C packages/web typecheck
pnpm -C packages/web lint
pnpm -C packages/web test
```
