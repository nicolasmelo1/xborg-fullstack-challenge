# syntax = docker/dockerfile:1

# Keep in sync with repo `.nvmrc`
ARG NODE_VERSION=23.9.0

FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps

ENV NODE_ENV="development"

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# This Dockerfile expects the build context to be the repo root.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY packages/config/package.json ./packages/config/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/auth-microsservice/package.json ./packages/auth-microsservice/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY packages/config ./packages/config
COPY packages/shared ./packages/shared
COPY packages/auth-microsservice ./packages/auth-microsservice

# Build shared runtime output (skip DTS generation to avoid requiring TypeScript in this package)
RUN pnpm -C packages/shared exec tsup ./src --format esm,cjs --no-splitting --sourcemap --clean
RUN pnpm -C packages/auth-microsservice build

FROM base AS runtime

ENV NODE_ENV="production"

COPY --from=build /app /app
RUN chmod +x /app/packages/auth-microsservice/docker-entrypoint.sh

ENTRYPOINT ["/app/packages/auth-microsservice/docker-entrypoint.sh"]
