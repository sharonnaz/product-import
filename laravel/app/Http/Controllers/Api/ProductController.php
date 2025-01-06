<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Jobs\ImportProducts;
use Illuminate\Support\Facades\Bus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductCollection;
use App\Http\Requests\ProductImportRequest;
use App\Http\Controllers\Api\BaseController as BaseController;

class ProductController extends BaseController
{
    /**
     * Handles the import of products via a CSV file.
     *
     * @param  ProductImportRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function importProduct(ProductImportRequest $request)
    {
        // Check if the request contains a 'csv' file
        if ($request->has('csv')) {
            // Read the CSV file into an array
            $csv = file($request->csv);
            
            // Split the CSV data into chunks of 1000 lines for processing in case of huge files
            $chunks = array_chunk($csv, 1000);

            $header = []; // Array to store the CSV header row
            $batch = Bus::batch([])->dispatch(); // Initialize a batch for processing jobs

            // Iterate through each chunk
            foreach ($chunks as $key => $chunk) {
                // Convert each line in the chunk into an array using str_getcsv
                $data = array_map('str_getcsv', $chunk);

                // Extract and store the header row from the first chunk
                if ($key == 0) {
                    $header = $data[0]; // The first row contains headers
                    unset($data[0]); // Remove the header row from the data array
                }

                // Add a new job to the batch for processing this chunk of data
                $batch->add(new ImportProducts($data, $header));
            }

            // Return a response indicating that the import is in progress
            return $this->sendResponse([], 'Product import in progress...');
        }

        // Return a bad request response if no CSV file is provided
        return $this->sendError('No CSV file provided.', [], 400);
    }

    /**
     * Retrieves a paginated list of products.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function listProduct(Request $request)
    {
        // Retrieve the latest products, paginated by 10 items per page
        $products = Product::latest()->paginate(10);
        return new ProductCollection($products);
        
    }
}
