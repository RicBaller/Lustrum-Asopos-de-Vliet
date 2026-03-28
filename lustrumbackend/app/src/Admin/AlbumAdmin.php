<?php

namespace App\Admin;

use App\Models\Album;
use SilverStripe\Admin\ModelAdmin;

class AlbumAdmin extends ModelAdmin
{
    private static array $managed_models = [
        Album::class,
    ];

    private static string $url_segment = 'fotoalbums';
    private static string $menu_title = "Fotoalbums";
    private static string $menu_icon_class = 'font-icon-picture';
}
