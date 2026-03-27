<?php

namespace App\Admin;

use App\Models\LustrumCommissieLid;
use App\Models\SubCommissie;
use SilverStripe\Admin\ModelAdmin;

class CommissieAdmin extends ModelAdmin
{
    private static array $managed_models = [
        LustrumCommissieLid::class => ['title' => 'Lustrum Commissie'],
        SubCommissie::class        => ['title' => 'Subcommissies'],
    ];

    private static string $url_segment = 'commissies';
    private static string $menu_title  = 'Commissies';
}
