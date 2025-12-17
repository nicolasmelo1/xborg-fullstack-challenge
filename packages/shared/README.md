## @xborg/shared

Shared code used by the web and the backend services.

### Tech

- TypeScript
- Built with `tsup`

### What it contains

- Shared domain types (`User`, `UpdateUserInput`, etc.)
- Backend event contracts (`EVENTS`, input/output types) used by NestJS microservices

### Commands

```bash
pnpm -C packages/shared build
pnpm -C packages/shared dev
```
