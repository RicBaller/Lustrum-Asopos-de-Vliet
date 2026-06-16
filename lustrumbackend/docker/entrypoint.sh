#!/bin/bash
set -e

# ── Wait for database ──────────────────────────────────────────────────────────
echo "Waiting for database at ${SS_DATABASE_SERVER}..."
max_tries=30
tries=0
until mysqladmin ping -h "${SS_DATABASE_SERVER}" -u "${SS_DATABASE_USERNAME}" \
      -p"${SS_DATABASE_PASSWORD}" --silent 2>/dev/null; do
    tries=$((tries + 1))
    if [ "$tries" -ge "$max_tries" ]; then
        echo "Database not reachable after ${max_tries} attempts — starting Apache anyway."
        break
    fi
    sleep 2
done
echo "Database is ready."

# ── Ensure writable dirs ───────────────────────────────────────────────────────
mkdir -p public/assets .graphql-generated silverstripe-cache
chown -R www-data:www-data public/assets .graphql-generated silverstripe-cache
chmod -R 775 public/assets .graphql-generated silverstripe-cache

# ── SilverStripe dev/build ──────────────────────────────────────────────────────
echo "Running dev/build flush=1 ..."
php vendor/bin/sake dev/build "flush=1" 2>&1 || \
    echo "WARNING: dev/build failed — check database connection and logs."

# ── Start Apache ────────────────────────────────────────────────────────────────
exec apache2-foreground
