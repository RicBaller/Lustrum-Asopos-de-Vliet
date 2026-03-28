<?php

namespace App\Admin;

use App\Models\Video;
use App\Models\VideoCategory;
use SilverStripe\Admin\ModelAdmin;

class VideoAdmin extends ModelAdmin
{
    private static array $managed_models = [
        Video::class,
        VideoCategory::class => ['title' => "Video Categorieën"],
    ];

    private static string $url_segment = 'videos';
    private static string $menu_title = "Video's";
    private static string $menu_icon_class = 'font-icon-monitor';
}
