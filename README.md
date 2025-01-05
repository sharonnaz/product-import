<h1 align="center">Laravel Vue Web App</h1>
<h3 align="center">Application using vue at the front-end and laravel at the backend to demonstrate signup, login and product csv import.</h3>


## Installation
- To get started, clone using the link https://github.com/sharonnaz/product-import.git.
- First configure the laravel part
- `cd product-import`
- `cd laravel`
- `composer update`
- `cp .env.example .env`
- Create a new MYSQL database and update database details in `.env` file
- Set QUEUE_CONNECTION=database in `.env` file
- `php artisan migrate`
- `php artisan serve`
- `php artisan queue:work`
- Now configure the vue part
- `npm install`
- `npm run dev`
-  Now click on the local url 



