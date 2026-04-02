<?php

namespace App\Api;

use App\Models\ProductCategory;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;

class CategoryController extends Controller
{
    private static array $allowed_actions = ['index', 'show'];

    private static array $url_handlers = [
        '$ID!' => 'show',
        ''     => 'index',
    ];

    public function index(HTTPRequest $request): HTTPResponse
    {
        $data = [];
        foreach (ProductCategory::get()->sort('Title ASC') as $category) {
            $data[] = $this->serialize($category);
        }

        return $this->jsonResponse($data);
    }

    public function show(HTTPRequest $request): HTTPResponse
    {
        $category = ProductCategory::get()->byID((int) $request->param('ID'));

        if (!$category) {
            return $this->jsonResponse(['error' => 'Categorie niet gevonden'], 404);
        }

        return $this->jsonResponse($this->serialize($category, withProducts: true));
    }

    private function serialize(ProductCategory $category, bool $withProducts = false): array
    {
        $data = [
            'id'    => $category->ID,
            'title' => $category->Title,
        ];

        if ($withProducts) {
            $products = [];
            foreach ($category->Products()->sort('SortOrder ASC, Title ASC') as $product) {
                $products[] = ['id' => $product->ID, 'title' => $product->Title];
            }
            $data['products'] = $products;
        }

        return $data;
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
