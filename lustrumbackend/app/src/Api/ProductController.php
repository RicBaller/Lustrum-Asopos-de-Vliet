<?php

namespace App\Api;

use App\Models\Product;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;

class ProductController extends Controller
{
    private static array $allowed_actions = ['index', 'show'];

    private static array $url_handlers = [
        '$ID!' => 'show',
        ''     => 'index',
    ];

    public function index(HTTPRequest $request): HTTPResponse
    {
        $products = Product::get()->sort('Title ASC');

        $categoryID = $request->getVar('category');
        if ($categoryID) {
            $products = $products->filter('CategoryID', (int) $categoryID);
        }

        $data = [];
        foreach ($products as $product) {
            $data[] = $this->serialize($product);
        }

        return $this->jsonResponse($data);
    }

    public function show(HTTPRequest $request): HTTPResponse
    {
        $product = Product::get()->byID((int) $request->param('ID'));

        if (!$product) {
            return $this->jsonResponse(['error' => 'Product niet gevonden'], 404);
        }

        return $this->jsonResponse($this->serialize($product));
    }

    private function serialize(Product $product): array
    {
        $images = [];
        foreach ($product->Images() as $image) {
            $images[] = $image->getAbsoluteURL();
        }

        return [
            'id'          => $product->ID,
            'title'       => $product->Title,
            'description' => $product->Description,
            'price'       => $product->Price,
            'link'        => $product->Link,
            'category'    => $product->Category()->exists()
                ? ['id' => $product->Category()->ID, 'title' => $product->Category()->Title]
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
