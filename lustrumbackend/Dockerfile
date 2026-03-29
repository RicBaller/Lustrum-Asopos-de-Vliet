# =============================================================================
# SilverStripe 6 production image for Dokploy
# Build:  docker build -t lustrum-backend .
# Run:    docker run --env-file .env -p 80:80 lustrum-backend
# =============================================================================

# ─── Stage 1: Composer install (production only) ────────────────────────────────
FROM composer:2 AS vendor

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader \
        --ignore-platform-reqs

# ─── Stage 2: Production image ──────────────────────────────────────────────────
FROM php:8.4-apache-bookworm

# ── PHP extensions ──────────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev \
        libicu-dev libtidy-dev libcurl4-openssl-dev libsodium-dev \
        libonig-dev zlib1g-dev unzip default-mysql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql mysqli gd intl mbstring tidy zip \
        fileinfo exif curl sodium opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ── Apache modules ──────────────────────────────────────────────────────────────
RUN a2enmod rewrite headers expires remoteip setenvif

# ── PHP config ──────────────────────────────────────────────────────────────────
COPY docker/php.ini /usr/local/etc/php/conf.d/silverstripe.ini

# OPcache tuned for production
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.validate_timestamps=0'; \
} > /usr/local/etc/php/conf.d/opcache.ini

# Logging to stderr (visible via docker logs / Dokploy logs)
RUN { \
    echo 'log_errors=On'; \
    echo 'error_log=/dev/stderr'; \
    echo 'display_errors=Off'; \
} > /usr/local/etc/php/conf.d/errors.ini

# ── Apache vhost — reverse-proxy aware (Traefik / Dokploy) ─────────────────────
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
RUN echo "ServerName localhost" > /etc/apache2/conf-available/fqdn.conf \
    && a2enconf fqdn

WORKDIR /var/www/html

# ── Application code (vendor/themes excluded by .dockerignore) ──────────────────
COPY --chown=www-data:www-data . .

# ── Composer-managed packages from stage 1 ──────────────────────────────────────
COPY --from=vendor --chown=www-data:www-data /app/vendor              ./vendor
COPY --from=vendor --chown=www-data:www-data /app/themes/startup-theme ./themes/startup-theme
COPY --from=vendor --chown=www-data:www-data /app/public/_resources   ./public/_resources

# ── Writable runtime dirs ───────────────────────────────────────────────────────
RUN mkdir -p public/assets .graphql-generated silverstripe-cache \
    && chown -R www-data:www-data public/assets .graphql-generated silverstripe-cache \
    && chmod 775 public/assets .graphql-generated silverstripe-cache

# ── Entrypoint ──────────────────────────────────────────────────────────────────
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
    CMD curl -sf http://localhost/api/v1 || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
