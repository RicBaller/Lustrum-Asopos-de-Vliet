<?php

namespace App\Api;

use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPResponse;

class HelloWorldController extends Controller
{
    private static $allowed_actions = [
        'hello',
    ];

    private static $url_handlers = [
        'hello' => 'hello',
        '' => 'index',
    ];

    public function index(): HTTPResponse
    {
        return $this->jsonResponse(['message' => 'Lustrum Asopos de Vliet API is running']);
    }

    public function hello(): HTTPResponse
    {
        return $this->jsonResponse(['message' => 'Hello World']);
    }

    private function jsonResponse(array $data): HTTPResponse
    {
        $response = $this->getResponse();
        $response->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode($data));
        return $response;
    }
}
