<?php

namespace App\Models;

use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\HasManyList;

/**
 * @property string $Title
 * @property int    $SortOrder
 * @method HasManyList<Video> Videos()
 */
class VideoCategory extends DataObject
{
    private static string $table_name = 'VideoCategory';

    private static array $db = [
        'Title'     => 'Varchar(255)',
        'SortOrder' => 'Int',
    ];

    private static string $default_sort = '"SortOrder" ASC';

    private static array $has_many = [
        'Videos' => Video::class,
    ];

    private static array $summary_fields = [
        'SortOrder'     => 'Volgorde',
        'Title'         => 'Naam',
        'Videos.Count'  => "Video's",
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();
        $fields->addFieldToTab('Root.Main', TextField::create('Title', 'Naam'));
        $fields->addFieldToTab(
            'Root.Main',
            NumericField::create('SortOrder', 'Volgorde')
                ->setDescription('0 = bovenaan (gereserveerd voor Bekendmaking). Hogere nummers staan verder naar beneden.')
        );
        return $fields;
    }

    public function requireDefaultRecords(): void
    {
        parent::requireDefaultRecords();

        $existing = VideoCategory::get()->filter('Title', 'Bekendmaking')->first();
        if (!$existing) {
            $category = VideoCategory::create();
            $category->Title = 'Bekendmaking';
            $category->SortOrder = 0;
            $category->write();
        } elseif ((int)$existing->SortOrder !== 0) {
            $existing->SortOrder = 0;
            $existing->write();
        }
    }
}
