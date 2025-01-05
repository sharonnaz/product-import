<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Bus\Batchable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Http\Requests\ProductCreateRequest;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class ImportProducts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;
    public $header, $data;

    /**
     * Create a new job instance.
     */
    public function __construct($data, $header)
    {
        $this->data = $data;
        $this->header = $header;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        foreach ($this->data as $product) {
            // Combine the row with header to get the correct fields
            $productInput = array_combine($this->header, $product);
            
            // Validate the product input data
            $validator = Validator::make($productInput, (new ProductCreateRequest())->rules());

            // If validation fails, skip the row and log the error
            if ($validator->fails()) {
                Log::error('Product import validation failed', [
                    'row' => $productInput,
                    'errors' => $validator->errors()
                ]);
                continue; // Skip this row
            }

            // Create the product if validation passes
            Product::create($productInput);
        }
    }
}
