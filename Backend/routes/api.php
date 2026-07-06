<?php

use App\Http\Controllers\FormController; //formcontroller import for the use
use Illuminate\Support\Facades\Route;   //route import for the route.

//form setup api post route.
Route::post('/forms', [FormController::class, 'store']);

//form submission api post route (saves user responses from the preview page).
Route::post('/form-submissions', [FormController::class, 'submitForm']);

