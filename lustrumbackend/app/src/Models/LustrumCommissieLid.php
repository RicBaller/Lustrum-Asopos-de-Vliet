<?php

namespace App\Models;

use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Assets\Image;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

/**
 * Lid van de overkoepelende Lustrum Commissie.
 *
 * @property string $Name
 * @property string $Function
 * @property int    $SortOrder
 * @property int    $PhotoID
 * @method   Image  Photo()
 */
class LustrumCommissieLid extends DataObject
{
    private static string $table_name = 'LustrumCommissieLid';

    private static array $db = [
        'Name'      => 'Varchar(255)',
        'Function'  => 'Varchar(255)',
        'SortOrder' => 'Int',
    ];

    private static array $has_one = [
        'Photo' => Image::class,
    ];

    private static array $owns = [
        'Photo',
    ];

    private static string $default_sort = '"SortOrder" ASC';

    private static array $summary_fields = [
        'Photo.CMSThumbnail' => 'Foto',
        'Name'               => 'Naam',
        'Function'           => 'Functie',
        'SortOrder'          => 'Volgorde',
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        $fields->addFieldsToTab('Root.Main', [
            NumericField::create('SortOrder', 'Volgorde'),
            TextField::create('Name', 'Naam'),
            TextField::create('Function', 'Functie'),
            UploadField::create('Photo', 'Foto')
                ->setAllowedFileCategories('image')
                ->setFolderName('commissie/lustrum'),
        ]);

        return $fields;
    }
}
