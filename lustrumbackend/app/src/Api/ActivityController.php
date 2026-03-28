<?php

namespace App\Api;

use App\Models\Activity;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;

class ActivityController extends Controller
{
    private static array $allowed_actions = ['index', 'show'];

    private static array $url_handlers = [
        '$ID!' => 'show',
        ''     => 'index',
    ];

    public function index(HTTPRequest $request): HTTPResponse
    {
        $activities = Activity::get()->sort('StartDate ASC');

        $data = [];
        foreach ($activities as $activity) {
            $data[] = $this->serialize($activity);
        }

        return $this->jsonResponse($data);
    }

    public function show(HTTPRequest $request): HTTPResponse
    {
        $activity = Activity::get()->byID((int) $request->param('ID'));

        if (!$activity) {
            return $this->jsonResponse(['error' => 'Activiteit niet gevonden'], 404);
        }

        return $this->jsonResponse($this->serialize($activity));
    }

    private function serialize(Activity $activity): array
    {
        return [
            'id'          => $activity->ID,
            'title'       => $activity->Title,
            'startDate'   => $activity->StartDate,
            'endDate'     => $activity->EndDate,
            'description' => $activity->Description,
            'ticketLink'  => $activity->TicketLink,
            'image'       => $activity->Image()->exists() ? $activity->Image()->getAbsoluteURL() : null,
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
