#!/bin/sh
set -e

# Run SilverStripe database build on every container start.
# This is idempotent — safe to run repeatedly.
php vendor/bin/sake dev/build flush=1

# Hand off to Apache (the default CMD from php:8.4-apache)
exec apache2-foreground
