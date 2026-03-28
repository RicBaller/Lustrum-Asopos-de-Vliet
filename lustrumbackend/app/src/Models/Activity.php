<?php

namespace App\Models;

use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Assets\Image;
use SilverStripe\Forms\DatetimeField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

class Activity extends DataObject
{
    private static string $table_name = 'Activity';

    private static array $db = [
        'Title'       => 'Varchar(255)',
        'StartDate'   => 'Datetime',
        'EndDate'     => 'Datetime',
        'Description' => 'HTMLText',
        'TicketLink'  => 'Varchar(255)',
    ];

    private static array $has_one = [
        'Image' => Image::class,
    ];

    private static array $owns = [
        'Image',
    ];

    private static array $summary_fields = [
        'Title'     => 'Titel',
        'StartDate' => 'Startdatum',
        'EndDate'   => 'Einddatum',
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('Title', 'Titel'),
            DatetimeField::create('StartDate', 'Startdatum en -tijd'),
            DatetimeField::create('EndDate', 'Einddatum en -tijd'),
            HTMLEditorField::create('Description', 'Omschrijving'),
            TextField::create('TicketLink', 'Ticketlink'),
            UploadField::create('Image', 'Afbeelding')
                ->setAllowedFileCategories('image')
                ->setFolderName('activiteiten'),
        ]);

        return $fields;
    }
}
