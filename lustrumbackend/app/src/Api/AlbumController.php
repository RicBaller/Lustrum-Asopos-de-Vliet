<?php

namespace App\Api;

use App\Models\Album;
use App\Models\Photo;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;

class AlbumController extends Controller
{
    private static array $allowed_actions = ['index', 'show'];

    private static array $url_handlers = [
        '$ID!' => 'show',
        ''     => 'index',
    ];

    public function index(HTTPRequest $request): HTTPResponse
    {
        $data = [];
        foreach (Album::get()->sort('Title ASC') as $album) {
            $data[] = $this->serializeSummary($album);
        }

        return $this->jsonResponse($data);
    }

    public function show(HTTPRequest $request): HTTPResponse
    {
        $album = Album::get()->byID((int) $request->param('ID'));

        if (!$album) {
            return $this->jsonResponse(['error' => 'Album niet gevonden'], 404);
        }

        return $this->jsonResponse($this->serializeDetail($album));
    }

    private function serializeSummary(Album $album): array
    {
        return [
            'id'                => $album->ID,
            'title'             => $album->Title,
            'description'       => $album->Description,
            'photoCount'        => $album->Photos()->count(),
            'coverPhotoUrl'     => $album->CoverPhoto()->exists() && $album->CoverPhoto()->Image()->exists()
                                    ? $album->CoverPhoto()->Image()->getAbsoluteURL()
                                    : null,
            'coverPhotographer' => $album->CoverPhoto()->exists() && $album->CoverPhoto()->Photographer()->exists()
                                    ? $album->CoverPhoto()->Photographer()->Name
                                    : null,
        ];
    }

    private function serializeDetail(Album $album): array
    {
        $photographers = [];
        foreach ($album->Photographers() as $photographer) {
            $photographers[] = [
                'id'   => $photographer->ID,
                'name' => $photographer->Name,
            ];
        }

        $photos = [];
        foreach ($album->Photos() as $photo) {
            /** @var Photo $photo */
            $photos[] = [
                'id'           => $photo->ID,
                'url'          => $photo->Image()->exists() ? $photo->Image()->getAbsoluteURL() : null,
                'photographer' => $photo->Photographer()->exists()
                    ? ['id' => $photo->Photographer()->ID, 'name' => $photo->Photographer()->Name]
                    : null,
            ];
        }

        return [
            'id'            => $album->ID,
            'title'         => $album->Title,
            'description'   => $album->Description,
            'photographers' => $photographers,
            'photos'        => $photos,
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
