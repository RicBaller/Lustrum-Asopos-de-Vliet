<?php

namespace App\Api;

use App\Models\Product;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;

class ProductController extends Controller
{
    private static array $allowed_actions = ['index', 'featured', 'show'];

    private static array $url_handlers = [
        'featured' => 'featured',
        '$ID!' => 'show',
        ''     => 'index',
    ];

    public function index(HTTPRequest $request): HTTPResponse
    {
        return $this->jsonResponse($this->serializeProducts($this->getProducts($request)));
    }

    public function featured(HTTPRequest $request): HTTPResponse
    {
        return $this->jsonResponse(
            $this->serializeProducts($this->getProducts($request)->filter('IsSpotlight', true))
        );
    }

    private function getProducts(HTTPRequest $request)
    {
        $products = Product::get()
            ->sort([
                'ProductCategory.Title' => 'ASC',
                'SortOrder'             => 'ASC',
                'Title'                 => 'ASC',
            ]);

        $categoryID = $request->getVar('category');
        if ($categoryID) {
            $products = $products->filter('ProductCategoryID', (int) $categoryID);
        }

        return $products;
    }

    public function show(HTTPRequest $request): HTTPResponse
    {
        $product = Product::get()->byID((int) $request->param('ID'));

        if (!$product) {
            return $this->jsonResponse(['error' => 'Product niet gevonden'], 404);
        }

        return $this->jsonResponse($this->serialize($product));
    }

    private function serializeProducts(iterable $products): array
    {
        $data = [];
        foreach ($products as $product) {
            $data[] = $this->serialize($product);
        }

        return $data;
    }

    private function serialize(Product $product): array
    {
        $images = [];
        foreach ($product->Images() as $image) {
            $url = $image->getAbsoluteURL();
            if ($url) {
                $images[] = $url;
            }
        }

        return [
            'id'          => $product->ID,
            'title'       => $product->Title,
            'description' => $product->Description,
            'price'       => $product->Price,
            'link'        => $product->Link,
            'sortOrder'   => $product->SortOrder,
            'isSpotlight' => (bool) $product->IsSpotlight,
            'category'    => $product->ProductCategory()->exists()
                ? [
                    'id'    => $product->ProductCategory()->ID,
                    'title' => $product->ProductCategory()->Title,
                ]
                : null,
            'images'      => $images,
        ];
    }

    private function jsonResponse(array $data, int $status = 200): HTTPResponse
    {
        $response = $this->getResponse();
        $response->setStatusCode($status);
        $response->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode($data));
        return $response;
    }
}
