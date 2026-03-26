<?php

namespace App\Admin;

use App\Models\Activity;
use SilverStripe\Admin\ModelAdmin;

class ActivityAdmin extends ModelAdmin
{
    private static array $managed_models = [
        Activity::class,
    ];

    private static string $url_segment = 'activiteiten';
    private static string $menu_title = 'Activiteiten';
    private static string $menu_icon_class = 'font-icon-calendar';
}
