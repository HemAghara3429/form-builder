<?php

use App\Http\Controllers\FormController; //formcontroller import for the use
use Illuminate\Support\Facades\Route;   //route import for the route.

//form setup api post route.
Route::post('/forms', [FormController::class, 'store']);

