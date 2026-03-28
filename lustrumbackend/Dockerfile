# ─── Stage 1: Production Composer install ──────────────────────────────────────
# Installs all production PHP dependencies, the startup theme (via
# silverstripe/vendor-plugin) and public/_resources in a clean image so the
# production stage never needs Composer or the build context to provide them.
FROM composer:2 AS vendor-prod

WORKDIR /app
COPY composer.json composer.lock ./

RUN composer install \
        --no-dev \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader \
        --ignore-platform-reqs

# ─── Stage 2: Shared PHP 8.3 + Apache base ─────────────────────────────────────
FROM php:8.4-apache AS base

# System libraries required by PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libzip-dev \
        libicu-dev \
        libtidy-dev \
        libcurl4-openssl-dev \
        libsodium-dev \
        libonig-dev \
        zlib1g-dev \
        unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mysqli \
        gd \
        intl \
        mbstring \
        tidy \
        zip \
        fileinfo \
        exif \
        curl \
        sodium \
    && a2enmod rewrite headers expires \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/php.ini     /usr/local/etc/php/conf.d/silverstripe.ini

WORKDIR /var/www/html

# ─── Stage 3: Development ──────────────────────────────────────────────────────
# Includes Composer and all dev dependencies (PHPUnit etc.).
# Source directories are bind-mounted by docker-compose.yml so edits are
# reflected immediately without rebuilding the image.
FROM base AS dev

# Borrow the Composer binary from the official image
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Install all dependencies (including dev) into the image layer.
# docker-compose.yml mounts named volumes on top of vendor/, themes/, etc.
# so these get pre-populated from the image on first volume creation.
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist

# Copy the rest of the source (vendor/themes/startup-theme are excluded by
# .dockerignore because composer already put them in place above)
COPY --chown=www-data:www-data . .

# Ensure writable runtime directories exist with correct ownership
RUN mkdir -p public/assets .graphql-generated \
    && chown -R www-data:www-data public/assets .graphql-generated \
    && chmod 775 public/assets .graphql-generated

EXPOSE 80

# ─── Stage 4: Production ───────────────────────────────────────────────────────
# Self-contained image suitable for deployment. No bind mounts required.
FROM base AS prod

# Copy application source first (vendor/themes/startup-theme/_resources are
# excluded by .dockerignore and will be provided by the vendor-prod stage)
COPY --chown=www-data:www-data . .

# Overlay composer-managed packages from the vendor-prod stage
COPY --from=vendor-prod --chown=www-data:www-data /app/vendor                  ./vendor
COPY --from=vendor-prod --chown=www-data:www-data /app/themes/startup-theme    ./themes/startup-theme
COPY --from=vendor-prod --chown=www-data:www-data /app/public/_resources       ./public/_resources

# Create writable runtime directories with correct ownership
RUN mkdir -p public/assets .graphql-generated \
    && chown -R www-data:www-data public/assets .graphql-generated \
    && chmod 775 public/assets .graphql-generated

EXPOSE 80
