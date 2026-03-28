<?php

use App\Admin\CommissieAdmin;
use SilverStripe\Admin\CMSMenu;
use SilverStripe\Admin\SecurityAdmin;
use SilverStripe\CMS\Controllers\CMSMain;
use SilverStripe\Core\Config\Config;
use SilverStripe\Reports\ReportAdmin;
use SilverStripe\SiteConfig\SiteConfigLeftAndMain;
use SilverStripe\VersionedAdmin\ArchiveAdmin;

// Remove pages, reports and archive from the sidebar
CMSMenu::remove_menu_class(CMSMain::class);
CMSMenu::remove_menu_class(ReportAdmin::class);
CMSMenu::remove_menu_class(ArchiveAdmin::class);

// Security just above Settings, both below all custom ModelAdmins (which default to 0)
Config::modify()->set(SecurityAdmin::class, 'menu_priority', -1);
Config::modify()->set(SiteConfigLeftAndMain::class, 'menu_priority', -2);

// Commissies icon
Config::modify()->set(CommissieAdmin::class, 'menu_icon_class', 'font-icon-torso');
