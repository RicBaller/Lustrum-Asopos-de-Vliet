<?php

namespace App\Middleware;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Control\Middleware\HTTPMiddleware;
use SilverStripe\Core\Environment;

class CorsMiddleware implements HTTPMiddleware
{
    public function process(HTTPRequest $request, callable $delegate): HTTPResponse
    {
        $origin = $this->normalizeOrigin($request->getHeader('Origin'));
        $allowed = $this->getAllowedOrigins();

        // Preflight OPTIONS request — respond immediately with headers
        if ($request->httpMethod() === 'OPTIONS' && $origin && $this->isAllowedOrigin($origin, $allowed)) {
            $response = HTTPResponse::create('', 204);
            $this->addHeaders($response, $origin);
            return $response;
        }

        /** @var HTTPResponse $response */
        $response = $delegate($request);

        if ($origin && $this->isAllowedOrigin($origin, $allowed)) {
            $this->addHeaders($response, $origin);
        }

        return $response;
    }

    private function addHeaders(HTTPResponse $response, string $origin): void
    {
        $response->addHeader('Access-Control-Allow-Origin', $origin);
        $response->addHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        $response->addHeader('Vary', 'Origin');
    }

    private function getAllowedOrigins(): array
    {
        $origins = [];

        // In dev mode: allow all common Angular dev server ports on localhost
        if (Environment::getEnv('SS_ENVIRONMENT_TYPE') === 'dev') {
            for ($port = 4200; $port <= 4210; $port++) {
                $origins[] = "http://localhost:{$port}";
            }
            $origins[] = 'http://localhost:3000';
        }

        // Production and/or extra origins from env variable (comma-separated)
        $envOrigins = Environment::getEnv('CORS_ALLOWED_ORIGINS');
        if ($envOrigins) {
            foreach (explode(',', $envOrigins) as $origin) {
                foreach ($this->expandConfiguredOrigin($origin) as $expandedOrigin) {
                    $origins[] = $expandedOrigin;
                }
            }
        }

        return array_unique($origins);
    }

    private function isAllowedOrigin(string $origin, array $allowedOrigins): bool
    {
        foreach ($allowedOrigins as $allowedOrigin) {
            if ($origin === $allowedOrigin || $this->matchesWildcardOrigin($origin, $allowedOrigin)) {
                return true;
            }
        }

        return false;
    }

    private function matchesWildcardOrigin(string $origin, string $allowedOrigin): bool
    {
        if (!str_contains($allowedOrigin, '*')) {
            return false;
        }

        $pattern = '/^' . str_replace('\\*', '[^/]+', preg_quote($allowedOrigin, '/')) . '$/';

        return (bool) preg_match($pattern, $origin);
    }

    private function expandConfiguredOrigin(string $origin): array
    {
        $origin = $this->normalizeOrigin($origin);
        if ($origin === null) {
            return [];
        }

        if (str_contains($origin, '://')) {
            return [$origin];
        }

        return [
            'https://' . $origin,
            'http://' . $origin,
        ];
    }

    private function normalizeOrigin(?string $origin): ?string
    {
        if ($origin === null) {
            return null;
        }

        $origin = trim($origin);
        if ($origin === '') {
            return null;
        }

        return rtrim($origin, '/');
    }
}
