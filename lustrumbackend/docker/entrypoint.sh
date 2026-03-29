#!/bin/sh
set -e

echo "⏳ Waiting for database at ${SS_DATABASE_SERVER}..."
timeout=60
elapsed=0
until mysqladmin ping -h "${SS_DATABASE_SERVER}" -u "${SS_DATABASE_USERNAME}" -p"${SS_DATABASE_PASSWORD}" --silent 2>/dev/null; do
    elapsed=$((elapsed + 2))
    if [ "$elapsed" -ge "$timeout" ]; then
        echo "❌ Database not reachable after ${timeout}s — starting Apache anyway."
        break
    fi
    sleep 2
done
echo "✅ Database is ready."

# Run SilverStripe database build on every container start.
# This is idempotent — safe to run repeatedly.
echo "🔨 Running dev/build..."
php vendor/bin/sake dev/build flush=1 || echo "⚠️ dev/build failed — check database connection."

# Hand off to Apache (the default CMD from php:8.4-apache)
exec apache2-foreground
