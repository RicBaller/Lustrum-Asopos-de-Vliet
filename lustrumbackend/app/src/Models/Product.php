<?php

namespace App\Models;

use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Assets\Image;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;
use SilverStripe\Versioned\Versioned;

/**
 * @property string $Title
 * @property string $Description
 * @property float  $Price
 * @property string $Link
 * @property int    $SortOrder
 * @property bool   $IsSpotlight
 * @property int    $ProductCategoryID
 * @method ProductCategory ProductCategory()
 */
class Product extends DataObject
{
    private static string $table_name = 'Product';

    private static array $db = [
        'Title'       => 'Varchar(255)',
        'Description' => 'HTMLText',
        'Price'       => 'Float',
        'Link'        => 'Varchar(255)',
        'SortOrder'   => 'Int',
        'IsSpotlight' => 'Boolean',
    ];

    private static array $defaults = [
        'IsSpotlight' => false,
    ];

    private static array $has_one = [
        'ProductCategory' => ProductCategory::class,
    ];

    private static array $many_many = [
        'Images' => Image::class,
    ];

    private static string $default_sort = '"SortOrder" ASC, "Title" ASC';

    private static array $summary_fields = [
        'Title'                   => 'Titel',
        'Price'                   => 'Prijs',
        'ProductCategory.Title'   => 'Categorie',
        'IsSpotlight.Nice'        => 'Uitgelicht',
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        $fields->removeByName([
            'Title',
            'Description',
            'Price',
            'Link',
            'SortOrder',
            'IsSpotlight',
            'ProductCategoryID',
            'Images',
        ]);

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('Title', 'Titel'),
            HTMLEditorField::create('Description', 'Omschrijving'),
            NumericField::create('Price', 'Prijs')->setScale(2),
            TextField::create('Link', 'Link'),
            DropdownField::create('ProductCategoryID', 'Categorie', ProductCategory::get()->map('ID', 'Title'))
                ->setEmptyString('-- Selecteer een categorie --'),
            CheckboxField::create('IsSpotlight', 'Uitgelicht'),
        ]);

        $fields->addFieldToTab(
            'Root.Afbeeldingen',
            UploadField::create('Images', 'Afbeeldingen')
                ->setAllowedFileCategories('image')
        );

        return $fields;
    }

    public function onAfterWrite(): void
    {
        parent::onAfterWrite();

        foreach ($this->Images() as $image) {
            if ($image->hasExtension(Versioned::class) && !$image->isPublished()) {
                $image->publishSingle();
            }
        }
    }
}
