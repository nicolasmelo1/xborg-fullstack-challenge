## @xborg/web

Next.js frontend for the challenge.

### Tech

- Next.js (App Router) + React
- Tailwind CSS
- TypeScript

### What it does

- Sign in flow (opens the backend Google OAuth flow in a popup and listens for a callback message)
- Profile page that displays and updates user profile data

### Environment variables

Copy `.env.example` to `.env`:

```bash
cp -n .env.example .env
```

Required:

- `API_GATEWAY_ORIGIN` (defaults to `http://localhost:3006`)

## Getting Started

Start the full stack from the repo root (recommended):

```bash
pnpm run up
pnpm run migration:run
pnpm run dev
```

Or run just the web app:

```bash
pnpm -C packages/web dev
```

### Tests

```bash
pnpm -C packages/web typecheck
pnpm -C packages/web lint
pnpm -C packages/web test
```

### Pages

- `/(unauthenticated)/signin`: sign in UI (opens popup to the API gateway)
- `/signin/callback`: popup callback (posts message to opener and closes)
- `/(authenticated)/profile`: profile view + update form
