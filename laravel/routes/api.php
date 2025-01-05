<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::controller(AuthController::class)->group(function(){
    Route::post('register', 'register');
    Route::post('login', 'login');
});

Route::middleware('auth:sanctum')->group( function () 
{
    Route::controller(ProductController::class)->group(function(){
        Route::post('import-products', 'importProduct');
        Route::post('list-products', 'listProduct');
    });

    Route::controller(AuthController::class)->group(function(){
        Route::post('logout', 'logout');
    });
});
