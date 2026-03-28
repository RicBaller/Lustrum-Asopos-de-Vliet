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
        $origin = $request->getHeader('Origin');
        $allowed = $this->getAllowedOrigins();

        // Preflight OPTIONS request — respond immediately with headers
        if ($request->httpMethod() === 'OPTIONS' && $origin && in_array($origin, $allowed, true)) {
            $response = HTTPResponse::create('', 204);
            $this->addHeaders($response, $origin);
            return $response;
        }

        /** @var HTTPResponse $response */
        $response = $delegate($request);

        if ($origin && in_array($origin, $allowed, true)) {
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
                $origin = trim($origin);
                if ($origin !== '') {
                    $origins[] = $origin;
                }
            }
        }

        return array_unique($origins);
    }
}
