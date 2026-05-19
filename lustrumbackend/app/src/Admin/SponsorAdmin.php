<?php

namespace App\Admin;

use App\Models\Sponsor;
use SilverStripe\Admin\ModelAdmin;

class SponsorAdmin extends ModelAdmin
{
    private static array $managed_models = [
        Sponsor::class,
    ];

    private static string $url_segment = 'sponsors';
    private static string $menu_title = 'Sponsors';
    private static string $menu_icon_class = 'font-icon-tag';
}
