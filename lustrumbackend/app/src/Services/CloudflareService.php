<?php

namespace App\Services;

use Psr\Log\LoggerInterface;
use SilverStripe\Core\Environment;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Core\Injector\Injector;

class CloudflareService
{
    use Injectable;

    private const API_BASE = 'https://api.cloudflare.com/client/v4';

    /**
     * Purges all cached content for every configured Cloudflare zone.
     * Silently skips when CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_IDS is absent.
     */
    public function purgeAll(): void
    {
        $token    = (string) Environment::getEnv('CLOUDFLARE_API_TOKEN');
        $rawZones = (string) Environment::getEnv('CLOUDFLARE_ZONE_IDS');

        $logger = $this->logger();

        if ($token === '') {
            $logger->warning('CloudflareService: CLOUDFLARE_API_TOKEN is not set — skipping purge.');
            return;
        }

        if ($rawZones === '') {
            $logger->warning('CloudflareService: CLOUDFLARE_ZONE_IDS is not set — skipping purge.');
            return;
        }

        $logger->info('CloudflareService: purge triggered.', [
            'token_prefix' => substr($token, 0, 8) . '...',
            'zone_ids'     => $rawZones,
        ]);

        foreach (explode(',', $rawZones) as $zoneId) {
            $zoneId = trim($zoneId);
            if ($zoneId === '') {
                continue;
            }

            $this->purgeZone($zoneId, $token);
        }
    }

    private function purgeZone(string $zoneId, string $token): void
    {
        $logger = $this->logger();
        $url    = sprintf('%s/zones/%s/purge_cache', self::API_BASE, $zoneId);

        $logger->info("CloudflareService: sending purge request for zone {$zoneId}.");

        $context = stream_context_create([
            'http' => [
                'method'        => 'POST',
                'header'        => "Content-Type: application/json\r\nAuthorization: Bearer {$token}",
                'content'       => json_encode(['purge_everything' => true], JSON_THROW_ON_ERROR),
                'timeout'       => 10,
                'ignore_errors' => true,
            ],
        ]);

        $body = file_get_contents($url, false, $context);

        // $http_response_header is populated by file_get_contents after an HTTP request.
        $statusLine = $http_response_header[0] ?? 'no response';

        if ($body === false) {
            $logger->error("CloudflareService: request failed for zone {$zoneId} — no response received.");
            return;
        }

        $decoded = json_decode($body, true);
        $success = $decoded['success'] ?? false;

        if ($success) {
            $logger->info("CloudflareService: zone {$zoneId} purged successfully.", [
                'status' => $statusLine,
            ]);
        } else {
            $logger->error("CloudflareService: purge failed for zone {$zoneId}.", [
                'status'   => $statusLine,
                'response' => $body,
            ]);
        }
    }

    private function logger(): LoggerInterface
    {
        return Injector::inst()->get(LoggerInterface::class . '.CloudflareService');
    }
}
