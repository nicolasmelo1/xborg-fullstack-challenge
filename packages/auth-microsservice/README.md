## @xborg/auth-microsservice

NestJS microservice responsible for authentication and profile persistence.

### Tech

- NestJS microservice (`@nestjs/microservices`) using Redis transport
- Postgres + TypeORM
- Google OAuth2 token exchange + ID token verification
- JWT signing

### What it does

- Receives events from the API gateway over Redis (no public HTTP server)
- Exchanges the Google `code` for tokens and verifies the ID token
- Creates/updates the user profile in Postgres
- Signs JWTs used by the API gateway for private endpoints

### Environment variables

Copy `.env.example` to `.env`:

```bash
cp -n .env.example .env
```

### Running

Recommended: start the whole stack from the repo root:

```bash
pnpm run up
pnpm run migration:run
pnpm run dev
```

Or run just the microservice:

```bash
pnpm -C packages/auth-microsservice dev
```

### Migrations

- Run migrations:

```bash
pnpm -C packages/auth-microsservice migration:run
```

- Generate migrations:

```bash
pnpm -C packages/auth-microsservice migration:generate
```

### Quality checks

```bash
pnpm -C packages/auth-microsservice lint
pnpm -C packages/auth-microsservice test
```
