<?php

namespace App\Extensions;

use App\Services\CloudflareService;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\ORM\DataExtension;

/**
 * Triggers a full Cloudflare cache purge after a DataObject is published.
 * Apply this extension (alongside Versioned) to any model whose content
 * should be invalidated on publish.
 */
class CloudflareCachePurgeExtension extends DataExtension
{
    public function onAfterPublish(): void
    {
        /** @var CloudflareService $service */
        $service = Injector::inst()->get(CloudflareService::class);
        $service->purgeAll();
    }
}
