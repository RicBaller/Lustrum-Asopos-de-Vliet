<?php

namespace App\Api;

use App\Models\Video;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;

class VideoController extends Controller
{
    private static array $allowed_actions = ['index', 'show'];

    private static array $url_handlers = [
        '$ID!' => 'show',
        ''     => 'index',
    ];

    /**
     * GET /api/v1/videos
     * GET /api/v1/videos?category={id}
     *
     * Geeft alle publieke video's terug, optioneel gefilterd op categorie.
     */
    public function index(HTTPRequest $request): HTTPResponse
    {
        $videos = Video::get()->filter('IsPublic', true)->sort('Title ASC');

        $categoryID = $request->getVar('category');
        if ($categoryID) {
            $videos = $videos->filter('VideoCategoryID', (int) $categoryID);
        }

        $data = [];
        foreach ($videos as $video) {
            $data[] = $this->serialize($video);
        }

        return $this->jsonResponse($data);
    }

    /**
     * GET /api/v1/videos/{id}
     *
     * Geeft één publieke video terug.
     */
    public function show(HTTPRequest $request): HTTPResponse
    {
        $video = Video::get()->filter('IsPublic', true)->byID((int) $request->param('ID'));

        if (!$video) {
            return $this->jsonResponse(['error' => 'Video niet gevonden'], 404);
        }

        return $this->jsonResponse($this->serialize($video));
    }

    private function serialize(Video $video): array
    {
        return [
            'id'         => $video->ID,
            'title'      => $video->Title,
            'youtubeURL' => $video->YoutubeURL,
            'credits'    => $video->Credits,
            'category'   => $video->VideoCategory()->exists()
                ? [
                    'id'        => $video->VideoCategory()->ID,
                    'title'     => $video->VideoCategory()->Title,
                    'sortOrder' => (int) $video->VideoCategory()->SortOrder,
                ]
                : null,
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
