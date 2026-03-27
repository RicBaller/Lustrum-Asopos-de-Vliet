<?php

namespace App\Api;

use App\Models\LustrumCommissieLid;
use App\Models\SubCommissie;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;

class CommissieController extends Controller
{
    private static array $allowed_actions = ['index', 'subcommissies', 'subcommissie'];

    private static array $url_handlers = [
        'subcommissies/$ID!' => 'subcommissie',
        'subcommissies'      => 'subcommissies',
        ''                   => 'index',
    ];

    /**
     * GET /api/v1/commissie
     * Geeft alle leden van de Lustrum Commissie terug, gesorteerd op SortOrder.
     */
    public function index(HTTPRequest $request): HTTPResponse
    {
        $data = [];
        foreach (LustrumCommissieLid::get()->sort('SortOrder ASC') as $lid) {
            $data[] = [
                'id'       => $lid->ID,
                'name'     => $lid->Name,
                'function' => $lid->Function,
                'order'    => $lid->SortOrder,
                'photo'    => $lid->Photo()->exists() ? $lid->Photo()->getAbsoluteURL() : null,
            ];
        }

        return $this->jsonResponse($data);
    }

    /**
     * GET /api/v1/commissie/subcommissies
     * Lijst van alle subcommissies met hun leden.
     */
    public function subcommissies(HTTPRequest $request): HTTPResponse
    {
        $data = [];
        foreach (SubCommissie::get()->sort('Name ASC') as $sub) {
            $data[] = $this->serializeSub($sub);
        }

        return $this->jsonResponse($data);
    }

    /**
     * GET /api/v1/commissie/subcommissies/{id}
     * Detail van één subcommissie.
     */
    public function subcommissie(HTTPRequest $request): HTTPResponse
    {
        $sub = SubCommissie::get()->byID((int) $request->param('ID'));

        if (!$sub) {
            return $this->jsonResponse(['error' => 'Subcommissie niet gevonden'], 404);
        }

        return $this->jsonResponse($this->serializeSub($sub));
    }

    private function serializeSub(SubCommissie $sub): array
    {
        $leden = [];
        foreach ($sub->Leden()->sort('SortOrder ASC') as $lid) {
            $leden[] = [
                'id'       => $lid->ID,
                'name'     => $lid->Name,
                'function' => $lid->Function,
                'order'    => $lid->SortOrder,
            ];
        }

        return [
            'id'    => $sub->ID,
            'name'  => $sub->Name,
            'photo' => $sub->Photo()->exists() ? $sub->Photo()->getAbsoluteURL() : null,
            'leden' => $leden,
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
