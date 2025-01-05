<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'sku',
        'description'
    ];

    protected function createdAt(): Attribute
    {
        return Attribute::get(function ($value) {
            return Carbon::parse($value)->format('d-m-Y H:i');
        });
    }
}
