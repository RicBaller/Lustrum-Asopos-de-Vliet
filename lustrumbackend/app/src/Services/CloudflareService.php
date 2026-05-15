<?php

namespace App\Services;

use SilverStripe\Core\Environment;
use SilverStripe\Core\Injector\Injectable;

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
        $token   = (string) Environment::getEnv('CLOUDFLARE_API_TOKEN');
        $rawZones = (string) Environment::getEnv('CLOUDFLARE_ZONE_IDS');

        if ($token === '' || $rawZones === '') {
            return;
        }

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

        $context = stream_context_create([
            'http' => [
                'method'        => 'POST',
                'header'        => "Content-Type: application/json\r\nAuthorization: Bearer {$token}",
                'content'       => json_encode(['purge_everything' => true], JSON_THROW_ON_ERROR),
                'timeout'       => 10,
                'ignore_errors' => true,
            ],
        ]);

        file_get_contents($url, false, $context);
    }
}
