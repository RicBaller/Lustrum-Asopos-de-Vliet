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
use Symbiote\GridFieldExtensions\GridFieldOrderableRows;

class ProductAdmin extends ModelAdmin
{
    private static array $managed_models = [
        Product::class,
        ProductCategory::class,
    ];

    private static string $url_segment = 'producten';
    private static string $menu_title  = 'Producten';
    private static string $menu_icon_class = 'font-icon-cart';

    private function buildGridConfig(): GridFieldConfig_RecordEditor
    {
        // Use a high page size so all items fit on one page (needed for drag-and-drop),
        // but keep GridFieldPaginator present so detail-form prev/next navigation works.
        $config = GridFieldConfig_RecordEditor::create(500);
        $config->addComponent(GridFieldOrderableRows::create('SortOrder'));
        return $config;
    }

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

            $gridField = GridField::create(
                'Category_' . $category->ID,
                $category->Title . ' (' . $products->count() . ')',
                $products,
                $this->buildGridConfig()
            );

            $tabs->push(Tab::create('category_' . $category->ID, $category->Title, $gridField));
        }

        // Tab for products without a category
        $uncategorized = Product::get()
            ->filter('ProductCategoryID', 0)
            ->sort('SortOrder ASC, Title ASC');

        $tabs->push(Tab::create(
            'category_overig',
            'Overig (' . $uncategorized->count() . ')',
            GridField::create('Category_overig', 'Overig', $uncategorized, $this->buildGridConfig())
        ));

        // Replace the default grid with our tabbed view
        $form->setFields(FieldList::create($tabs));

        return $form;
    }
}
