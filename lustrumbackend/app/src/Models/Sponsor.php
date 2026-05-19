<?php

namespace App\Models;

use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Assets\Image;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextareaField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

class Sponsor extends DataObject
{
    private static string $table_name = 'Sponsor';

    private static array $db = [
        'Title'         => 'Varchar(255)',
        'Description'   => 'Text',
        'URL'           => 'Varchar(255)',
        'SortOrder'     => 'Int',
        'IsMainSponsor' => 'Boolean',
    ];

    private static array $has_one = [
        'Image' => Image::class,
    ];

    private static array $owns = [
        'Image',
    ];

    private static array $summary_fields = [
        'Title'         => 'Naam',
        'URL'           => 'Website',
        'IsMainSponsor' => 'Hoofdsponsor',
        'SortOrder'     => 'Volgorde',
    ];

    private static string $default_sort = 'SortOrder ASC, Title ASC';

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('Title', 'Naam'),
            TextField::create('URL', 'Website URL'),
            TextareaField::create('Description', 'Omschrijving'),
            CheckboxField::create('IsMainSponsor', 'Hoofdsponsor'),
            TextField::create('SortOrder', 'Volgorde (lager = eerder)'),
            UploadField::create('Image', 'Logo / Afbeelding')
                ->setAllowedFileCategories('image')
                ->setFolderName('sponsors'),
        ]);

        return $fields;
    }
}
