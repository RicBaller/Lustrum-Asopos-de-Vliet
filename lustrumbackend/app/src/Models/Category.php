<?php

namespace App\Models;

use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

class Category extends DataObject
{
    private static string $table_name = 'Category';

    private static array $db = [
        'Title' => 'Varchar(255)',
    ];

    private static array $summary_fields = [
        'Title' => 'Titel',
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        $fields->addFieldToTab('Root.Main', TextField::create('Title', 'Titel'));

        return $fields;
    }
}
