<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray($request)
    {
        return [
            'success' => true,
            'data' => [
                'current_page' => $this->currentPage(),
                'data' => $this->collection,
                'first_page_url' => $this->url(1),
                'from' => $this->firstItem(),
                'last_page' => $this->lastPage(),
                'last_page_url' => $this->url($this->lastPage()),
                'links' => [
                    [
                        'url' => $this->previousPageUrl(),
                        'label' => '&laquo; Previous',
                        'active' => false,
                    ],
                    ...$this->getLinks(),
                    [
                        'url' => $this->nextPageUrl(),
                        'label' => 'Next &raquo;',
                        'active' => false,
                    ],
                ],
                'next_page_url' => $this->nextPageUrl(),
                'path' => $this->path(),
                'per_page' => $this->perPage(),
                'prev_page_url' => $this->previousPageUrl(),
                'to' => $this->lastItem(),
                'total' => $this->total(),
            ],
            'message' => "Products retrieved successfully."
        ];
    }

    private function getLinks()
    {
        return collect(range(1, $this->lastPage()))->map(function ($page) {
            return [
                'url' => $page == $this->currentPage() ? null : $this->url($page),
                'label' => (string)$page,
                'active' => $page == $this->currentPage(),
            ];
        })->toArray();
    }
}
