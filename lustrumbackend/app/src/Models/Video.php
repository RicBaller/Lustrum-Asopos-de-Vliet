<?php

namespace App\Models;

use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

/**
 * @property string $Title
 * @property string $YoutubeURL
 * @property bool   $IsPublic
 * @property string $Credits
 * @property int    $VideoCategoryID
 * @method VideoCategory VideoCategory()
 */
class Video extends DataObject
{
    private static string $table_name = 'Video';

    private static array $db = [
        'Title'      => 'Varchar(255)',
        'YoutubeURL' => 'Varchar(255)',
        'IsPublic'   => 'Boolean',
        'Credits'    => 'Varchar(255)',
    ];

    private static array $has_one = [
        'VideoCategory' => VideoCategory::class,
    ];

    private static array $defaults = [
        'IsPublic' => false,
    ];

    private static array $summary_fields = [
        'Title'               => 'Titel',
        'VideoCategory.Title' => 'Categorie',
        'IsPublic'            => 'Publiek',
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('Title', 'Titel'),
            TextField::create('YoutubeURL', 'YouTube URL'),
            TextField::create('Credits', 'Credits'),
            DropdownField::create('VideoCategoryID', 'Categorie', VideoCategory::get()->map('ID', 'Title'))
                ->setEmptyString('-- Selecteer een categorie --'),
            CheckboxField::create('IsPublic', 'Publiek zichtbaar'),
        ]);

        return $fields;
    }
}
