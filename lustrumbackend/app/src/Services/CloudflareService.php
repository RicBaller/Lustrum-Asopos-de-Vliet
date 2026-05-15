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

        if ($token === '') {
            $this->log('warning', 'CLOUDFLARE_API_TOKEN is not set — skipping purge.');
            return;
        }

        if ($rawZones === '') {
            $this->log('warning', 'CLOUDFLARE_ZONE_IDS is not set — skipping purge.');
            return;
        }

        $this->log('info', 'Purge triggered.', [
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
        $url = sprintf('%s/zones/%s/purge_cache', self::API_BASE, $zoneId);

        $this->log('info', "Sending purge request for zone {$zoneId}.");

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
            $this->log('error', "Request failed for zone {$zoneId} — no response received.");
            return;
        }

        $decoded = json_decode($body, true);
        $success = $decoded['success'] ?? false;

        if ($success) {
            $this->log('info', "Zone {$zoneId} purged successfully.", ['status' => $statusLine]);
        } else {
            $this->log('error', "Purge failed for zone {$zoneId}.", [
                'status'   => $statusLine,
                'response' => $body,
            ]);
        }
    }

    private function logger(): LoggerInterface
    {
        return Injector::inst()->get(LoggerInterface::class . '.CloudflareService');
    }

    private function log(string $level, string $message, array $context = []): void
    {
        // Write to both the PSR-3 logger (StreamHandler → stderr) and PHP's error_log
        // so the message always appears in Docker logs regardless of SS config.
        $this->logger()->{$level}($message, $context);
        $contextStr = empty($context) ? '' : ' ' . json_encode($context);
        error_log("[CloudflareService] [{$level}] {$message}{$contextStr}");
    }
}
