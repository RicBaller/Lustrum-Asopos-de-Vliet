<?php

namespace App\Admin;

use App\Models\Category;
use App\Models\Product;
use SilverStripe\Admin\ModelAdmin;

class ProductAdmin extends ModelAdmin
{
    private static array $managed_models = [
        Product::class,
        Category::class,
    ];

    private static string $url_segment = 'producten';
    private static string $menu_title = 'Producten';
    private static string $menu_icon_class = 'font-icon-cart';
}
