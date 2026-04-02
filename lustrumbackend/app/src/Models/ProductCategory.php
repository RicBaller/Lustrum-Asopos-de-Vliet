<?php

namespace App\Models;

use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\HasManyList;

/**
 * @property string $Title
 * @method HasManyList<Product> Products()
 */
class ProductCategory extends DataObject
{
    private static string $table_name = 'ProductCategory';

    private static array $db = [
        'Title' => 'Varchar(255)',
    ];

    private static array $has_many = [
        'Products' => Product::class,
    ];

    private static array $summary_fields = [
        'Title'          => 'Titel',
        'Products.Count' => 'Producten',
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        $fields->addFieldToTab('Root.Main', TextField::create('Title', 'Titel'));

        return $fields;
    }
}
