<?php

namespace App\Models;

use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldAddExistingAutocompleter;
use SilverStripe\Forms\GridField\GridFieldConfig_RecordEditor;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\HasManyList;

/**
 * @property string $Title
 * @property string $Description
 * @property int $CoverPhotoID
 * @method Photo CoverPhoto()
 * @method HasManyList<Photographer> Photographers()
 * @method HasManyList<Photo> Photos()
 */
class Album extends DataObject
{
    private static string $table_name = 'Album';

    private static array $db = [
        'Title'       => 'Varchar(255)',
        'Description' => 'HTMLText',
    ];

    private static array $has_one = [
        'CoverPhoto' => Photo::class,
    ];

    private static array $has_many = [
        'Photographers' => Photographer::class,
        'Photos'        => Photo::class,
    ];

    private static array $summary_fields = [
        'Title'           => 'Titel',
        'Photographers.Count' => 'Fotografen',
        'Photos.Count'    => "Foto's",
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        // Remove auto-scaffolded relations
        $fields->removeByName(['Photographers', 'Photos', 'CoverPhotoID']);

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('Title', 'Titel'),
            HTMLEditorField::create('Description', 'Omschrijving'),
        ]);

        if ($this->ID) {
            // Omslagfoto tab — kies een foto uit de al geüploade albumfoto's
            $photoOptions = ['' => '-- Geen omslagfoto --'];
            foreach ($this->Photos() as $photo) {
                /** @var Photo $photo */
                $label = $photo->Image()->exists() ? $photo->Image()->Name : 'Foto #' . $photo->ID;
                if ($photo->Photographer()->exists()) {
                    $label .= ' (' . $photo->Photographer()->Name . ')';
                }
                $photoOptions[$photo->ID] = $label;
            }

            $fields->addFieldToTab(
                'Root.Omslagfoto',
                DropdownField::create('CoverPhotoID', 'Omslagfoto', $photoOptions)
                    ->setEmptyString('-- Geen omslagfoto --')
            );
        }

        $photographerConfig = GridFieldConfig_RecordEditor::create();
        $photographerConfig->removeComponentsByType(GridFieldAddExistingAutocompleter::class);
        $fields->addFieldToTab(
            'Root.Fotografen',
            GridField::create('Photographers', 'Fotografen', $this->Photographers(), $photographerConfig)
        );

        // Fotos tab — only show after the album is saved so we have an ID for scoping
        if ($this->ID) {
            $photoConfig = GridFieldConfig_RecordEditor::create();
            $photoConfig->removeComponentsByType(GridFieldAddExistingAutocompleter::class);

            $fields->addFieldToTab(
                "Root.Foto's",
                GridField::create("PhotosGrid", "Foto's beheren", $this->Photos(), $photoConfig)
            );
        }

        return $fields;
    }

    /**
     * Ensure newly added photos are linked to this album.
     */
    protected function onAfterWrite(): void
    {
        parent::onAfterWrite();

        foreach ($this->Photos() as $photo) {
            if (!$photo->AlbumID) {
                $photo->AlbumID = $this->ID;
                $photo->write();
            }
        }
    }
}
