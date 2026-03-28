<?php

namespace App\Models;

use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Assets\Image;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

class Product extends DataObject
{
    private static string $table_name = 'Product';

    private static array $db = [
        'Title'       => 'Varchar(255)',
        'Description' => 'HTMLText',
        'Price'       => 'Float',
        'Link'        => 'Varchar(255)',
    ];

    private static array $has_one = [
        'Category' => Category::class,
    ];

    private static array $many_many = [
        'Images' => Image::class,
    ];

    private static array $summary_fields = [
        'Title'          => 'Titel',
        'Price'          => 'Prijs',
        'Category.Title' => 'Categorie',
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('Title', 'Titel'),
            HTMLEditorField::create('Description', 'Omschrijving'),
            NumericField::create('Price', 'Prijs')->setScale(2),
            TextField::create('Link', 'Link'),
            DropdownField::create('CategoryID', 'Categorie', Category::get()->map('ID', 'Title'))
                ->setEmptyString('-- Selecteer een categorie --'),
        ]);

        $fields->addFieldToTab(
            'Root.Afbeeldingen',
            UploadField::create('Images', 'Afbeeldingen')
                ->setAllowedFileCategories('image')
        );

        return $fields;
    }
}
