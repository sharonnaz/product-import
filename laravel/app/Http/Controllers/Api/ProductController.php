<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Jobs\ImportProducts;
use Illuminate\Support\Facades\Bus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Requests\ProductImportRequest;
use App\Http\Controllers\Api\BaseController as BaseController;

class ProductController extends BaseController
{
    public function importProduct(ProductImportRequest $request)
    {
        if( $request->has('csv') ) 
        {
            $csv    = file($request->csv);
            $chunks = array_chunk($csv, 1000);
            $header = [];
            $batch  = Bus::batch([])->dispatch();

            foreach ($chunks as $key => $chunk) 
            {
                $data = array_map('str_getcsv', $chunk);
                    if($key == 0)
                    {
                        $header = $data[0];
                        unset($data[0]);
                    }

                    $batch->add(new ImportProducts($data, $header));

            }
            return $this->sendResponse([], 'Product import in progress...');

        }
    }

    public function listProduct(Request $request)
    {
        // dd($request->all());

        
        $products = Product::latest()->paginate(10); 
        return $this->sendResponse($products, 'Products retrieved successfully.');
    }
}
