<h1 align="center">Laravel Vue Web App</h1>
<h3 align="center">Application using vue at the front-end and laravel at the backend to demonstrate signup, login and product csv import.</h3>


## Installation
- To get started, clone using the link https://github.com/sharonnaz/product-import.git.
- `cd product-import`
- `cd laravel`
- `composer update`
- `cp .env.example .env`
- Create a new MYSQL database and update database details in `.env` file
- `php artisan vendor:publish --tag=admin-core`
- `php artisan migrate --seed --seeder=AdminCoreSeeder`
- `php artisan storage:link`
- `npm install`
- `npm run dev`
- `php artisan serve`
- Now open http://localhost:8000/

###### Super Admin Login
- Email - superadmin@example.com
- Password - password


```


```


