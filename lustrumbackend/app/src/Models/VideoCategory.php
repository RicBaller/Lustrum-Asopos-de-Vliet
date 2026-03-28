<?php

namespace App\Models;

use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\HasManyList;

/**
 * @property string $Title
 * @method HasManyList<Video> Videos()
 */
class VideoCategory extends DataObject
{
    private static string $table_name = 'VideoCategory';

    private static array $db = [
        'Title' => 'Varchar(255)',
    ];

    private static array $has_many = [
        'Videos' => Video::class,
    ];

    private static array $summary_fields = [
        'Title'         => 'Naam',
        'Videos.Count'  => "Video's",
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();
        $fields->addFieldToTab('Root.Main', TextField::create('Title', 'Naam'));
        return $fields;
    }

    public function requireDefaultRecords(): void
    {
        parent::requireDefaultRecords();

        if (!VideoCategory::get()->filter('Title', 'Bekendmaking')->first()) {
            $category = VideoCategory::create();
            $category->Title = 'Bekendmaking';
            $category->write();
        }
    }
}
