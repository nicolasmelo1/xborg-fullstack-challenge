#!/bin/sh
set -eu

cd /app

echo "Running database migrations..."

attempts="${MIGRATION_ATTEMPTS:-15}"
sleep_seconds="${MIGRATION_SLEEP_SECONDS:-2}"
i=1

while [ "$i" -le "$attempts" ]; do
  if pnpm -C packages/auth-microsservice migration:run; then
    echo "Migrations completed."
    break
  fi

  echo "Migration attempt $i/$attempts failed; retrying in ${sleep_seconds}s..."
  i=$((i + 1))
  sleep "$sleep_seconds"
done

if [ "$i" -gt "$attempts" ]; then
  echo "Migrations failed after ${attempts} attempts."
  exit 1
fi

exec pnpm -C packages/auth-microsservice start:prod
