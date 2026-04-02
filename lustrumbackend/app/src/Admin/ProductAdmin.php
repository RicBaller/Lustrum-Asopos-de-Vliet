<?php

namespace App\Admin;

use App\Models\Product;
use App\Models\ProductCategory;
use SilverStripe\Admin\ModelAdmin;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldConfig_RecordEditor;
use SilverStripe\Forms\TabSet;
use SilverStripe\Forms\Tab;

class ProductAdmin extends ModelAdmin
{
    private static array $managed_models = [
        Product::class,
        ProductCategory::class,
    ];

    private static string $url_segment = 'producten';
    private static string $menu_title  = 'Producten';
    private static string $menu_icon_class = 'font-icon-cart';

    /**
     * Override the default edit form for Products to show one tab per category,
     * each with its own drag-sortable GridField.
     */
    public function getEditForm($id = null, $fields = null): Form
    {
        $form = parent::getEditForm($id, $fields);

        // Only customise the Products tab
        if ($this->modelClass !== Product::class) {
            return $form;
        }

        $categories = ProductCategory::get()->sort('Title ASC');

        if ($categories->count() === 0) {
            return $form;
        }

        $tabs = TabSet::create('Root');

        foreach ($categories as $category) {
            $products = Product::get()
                ->filter('ProductCategoryID', $category->ID)
                ->sort('SortOrder ASC, Title ASC');

            $config = GridFieldConfig_RecordEditor::create(25);
            if (class_exists('Symbiote\GridFieldExtensions\GridFieldOrderableRows')) {
                $config->addComponent(
                    \Symbiote\GridFieldExtensions\GridFieldOrderableRows::create('SortOrder')
                );
            }

            // Show category change in the inline editor
            $gridField = GridField::create(
                'Category_' . $category->ID,
                $category->Title . ' (' . $products->count() . ')',
                $products,
                $config
            );

            $tabs->push(Tab::create('category_' . $category->ID, $category->Title, $gridField));
        }

        // Tab for products without a category
        $uncategorized = Product::get()
            ->filter('ProductCategoryID', 0)
            ->sort('SortOrder ASC, Title ASC');

        $uncatConfig = GridFieldConfig_RecordEditor::create(25);
        if (class_exists('Symbiote\GridFieldExtensions\GridFieldOrderableRows')) {
            $uncatConfig->addComponent(
                \Symbiote\GridFieldExtensions\GridFieldOrderableRows::create('SortOrder')
            );
        }

        $tabs->push(Tab::create(
            'category_overig',
            'Overig (' . $uncategorized->count() . ')',
            GridField::create('Category_overig', 'Overig', $uncategorized, $uncatConfig)
        ));

        // Replace the default grid with our tabbed view
        $form->setFields(FieldList::create($tabs));

        return $form;
    }
}
