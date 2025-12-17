## @xborg/api-gateway

NestJS HTTP gateway for the challenge.

### Tech

- NestJS (HTTP server)
- `@nestjs/microservices` client over Redis transport
- JWT auth via HTTP-only cookies

### What it does

- Exposes the HTTP API used by the web app
- Starts Google OAuth (`GET /auth/login/google`) and handles the callback (`GET /auth/validate/google`)
- Sets session cookies and protects private endpoints
- Communicates with `@xborg/auth-microsservice` via Redis

### Environment variables

Copy `.env.example` to `.env`:

```bash
cp -n .env.example .env
```

### Running

Recommended: start the whole stack from repo root:

```bash
pnpm run up
pnpm run migration:run
pnpm run dev
```

Or run just the API gateway:

```bash
pnpm -C packages/api-gateway dev
```

### Quality checks

```bash
pnpm -C packages/api-gateway lint
pnpm -C packages/api-gateway test
```

### Endpoints

- Public:
  - `GET /auth/login/google`
  - `GET /auth/validate/google`
- Private:
  - `GET /user/profile`
  - `PUT /user/profile`

### API docs (Swagger)

Swagger UI is available at:

- `http://localhost:3006/docs` (local)

Notes:

- Enabled by default when `NODE_ENV` is not `production`.
- Set `SWAGGER_ENABLED=true` to enable in production.
