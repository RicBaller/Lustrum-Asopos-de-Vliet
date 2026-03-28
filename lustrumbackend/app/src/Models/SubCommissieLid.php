<?php

namespace App\Models;

use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

/**
 * Lid van een subcommissie — geen individuele foto, alleen naam en functie.
 *
 * @property string $Name
 * @property string $Function
 * @property int    $SortOrder
 * @property int    $SubCommissieID
 * @method   SubCommissie SubCommissie()
 */
class SubCommissieLid extends DataObject
{
    private static string $table_name = 'SubCommissieLid';

    private static array $db = [
        'Name'      => 'Varchar(255)',
        'Function'  => 'Varchar(255)',
        'SortOrder' => 'Int',
    ];

    private static array $has_one = [
        'SubCommissie' => SubCommissie::class,
    ];

    private static string $default_sort = '"SortOrder" ASC';

    private static array $summary_fields = [
        'Name'      => 'Naam',
        'Function'  => 'Functie',
        'SortOrder' => 'Volgorde',
    ];

    public function getCMSFields(): FieldList
    {
        $fields = parent::getCMSFields();

        $fields->addFieldsToTab('Root.Main', [
            NumericField::create('SortOrder', 'Volgorde'),
            TextField::create('Name', 'Naam'),
            TextField::create('Function', 'Functie'),
        ]);

        return $fields;
    }
}
