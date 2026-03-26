<?php

namespace App\Models;

use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\HasManyList;

/**
 * @property string $Name
 * @property int $AlbumID
 * @method HasManyList<Photo> Photos()
 * @method Album Album()
 */
class Photographer extends DataObject
{
    private static string $table_name = 'Photographer';

    private static array $db = [
        'Name' => 'Varchar(255)',
    ];

    private static array $has_one = [
        'Album' => Album::class,
    ];

    private static array $has_many = [
        'Photos' => Photo::class,
    ];

    private static array $summary_fields = [
        'Name' => 'Naam',
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();
        $fields->addFieldToTab('Root.Main', TextField::create('Name', 'Naam'));
        return $fields;
    }
}
