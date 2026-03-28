<?php

namespace App\Models;

use SilverStripe\Assets\Image;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\ORM\DataObject;

/**
 * @property int $AlbumID
 * @property int $PhotographerID
 * @property int $ImageID
 * @method Album Album()
 * @method Photographer Photographer()
 * @method Image Image()
 */
class Photo extends DataObject
{
    private static string $table_name = 'Photo';

    private static array $has_one = [
        'Album'        => Album::class,
        'Photographer' => Photographer::class,
        'Image'        => Image::class,
    ];

    private static array $owns = [
        'Image',
    ];

    private static array $summary_fields = [
        'Image.CMSThumbnail' => 'Foto',
        'Photographer.Name'  => 'Fotograaf',
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        if ($this->AlbumID) {
            $photographers = Photographer::get()
                ->filter('AlbumID', $this->AlbumID)
                ->map('ID', 'Name');

            $fields->addFieldToTab(
                'Root.Main',
                DropdownField::create('PhotographerID', 'Fotograaf', $photographers)
                    ->setEmptyString('-- Geen fotograaf --')
            );
        }

        return $fields;
    }
}
