<?php

namespace App\Api;

use App\Models\Sponsor;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;

class SponsorController extends Controller
{
    private static array $allowed_actions = ['index', 'show'];

    private static array $url_handlers = [
        '$ID!' => 'show',
        ''     => 'index',
    ];

    public function index(HTTPRequest $request): HTTPResponse
    {
        $sponsors = Sponsor::get()->sort('SortOrder ASC, Title ASC');

        $data = [];
        foreach ($sponsors as $sponsor) {
            $data[] = $this->serialize($sponsor);
        }

        return $this->jsonResponse($data);
    }

    public function show(HTTPRequest $request): HTTPResponse
    {
        $sponsor = Sponsor::get()->byID((int) $request->param('ID'));

        if (!$sponsor) {
            return $this->jsonResponse(['error' => 'Sponsor niet gevonden'], 404);
        }

        return $this->jsonResponse($this->serialize($sponsor));
    }

    private function serialize(Sponsor $sponsor): array
    {
        return [
            'id'            => $sponsor->ID,
            'title'         => $sponsor->Title,
            'description'   => $sponsor->Description,
            'url'           => $sponsor->URL,
            'sortOrder'     => $sponsor->SortOrder,
            'isMainSponsor' => (bool) $sponsor->IsMainSponsor,
            'image'         => $sponsor->Image()->exists() ? $sponsor->Image()->getAbsoluteURL() : null,
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
