<?php

namespace App\Extensions;

use App\Services\CloudflareService;
use SilverStripe\Core\Extension;
use SilverStripe\Core\Injector\Injector;

/**
 * Triggers a full Cloudflare cache purge after a DataObject is written.
 * Apply this extension to any model whose content should be invalidated on save.
 */
class CloudflareCachePurgeExtension extends Extension
{
    public function onAfterWrite(): void
    {
        /** @var CloudflareService $service */
        $service = Injector::inst()->get(CloudflareService::class);
        $service->purgeAll();
    }
}
