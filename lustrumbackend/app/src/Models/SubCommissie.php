<?php

namespace App\Models;

use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Assets\Image;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldAddExistingAutocompleter;
use SilverStripe\Forms\GridField\GridFieldConfig_RecordEditor;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\HasManyList;

/**
 * Een subcommissie die meehelpt aan het lustrum.
 *
 * @property string      $Name
 * @property int         $PhotoID
 * @method   Image       Photo()
 * @method   HasManyList<SubCommissieLid> Leden()
 */
class SubCommissie extends DataObject
{
    private static string $table_name = 'SubCommissie';

    private static array $db = [
        'Name' => 'Varchar(255)',
    ];

    private static array $has_one = [
        'Photo' => Image::class,
    ];

    private static array $owns = [
        'Photo',
    ];

    private static array $has_many = [
        'Leden' => SubCommissieLid::class,
    ];

    private static array $summary_fields = [
        'Photo.CMSThumbnail' => 'Foto',
        'Name'               => 'Naam',
        'Leden.Count'        => 'Leden',
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        $fields->removeByName('Leden');

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('Name', 'Naam'),
            UploadField::create('Photo', 'Groepsfoto')
                ->setAllowedFileCategories('image')
                ->setFolderName('commissie/subjes'),
        ]);

        if ($this->ID) {
            $ledenConfig = GridFieldConfig_RecordEditor::create();
            $ledenConfig->removeComponentsByType(GridFieldAddExistingAutocompleter::class);

            $fields->addFieldToTab(
                'Root.Leden',
                GridField::create('Leden', 'Leden', $this->Leden(), $ledenConfig)
            );
        }

        return $fields;
    }
}
