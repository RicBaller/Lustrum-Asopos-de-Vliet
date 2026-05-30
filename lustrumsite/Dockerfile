# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

ARG ENVIRONMENT=production

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration ${ENVIRONMENT}

# Stage 2: Serve
FROM nginx:alpine

COPY --from=builder /app/dist/lustrumsite/browser /usr/share/nginx/html

# SPA fallback: redirect all 404s to index.html
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    gzip on;\n\
    gzip_comp_level 5;\n\
    gzip_vary on;\n\
    gzip_types text/plain text/css application/json application/javascript application/xml+rss image/svg+xml;\n\
\n\
    location = /index.html {\n\
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;\n\
    }\n\
\n\
    location ~* \\.(?:css|js|mjs|json|woff2?|ttf|otf|svg|gif|png|jpg|jpeg|webp|avif)$ {\n\
        expires 30d;\n\
        add_header Cache-Control "public, max-age=2592000, immutable" always;\n\
        try_files $uri =404;\n\
    }\n\
\n\
    location = /sitemap.xml {\n\
        add_header Cache-Control "public, max-age=3600" always;\n\
    }\n\
\n\
    location = /robots.txt {\n\
        add_header Cache-Control "public, max-age=3600" always;\n\
    }\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
