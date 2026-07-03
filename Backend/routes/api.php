<?php

use App\Http\Controllers\FormController;
use Illuminate\Support\Facades\Route;

//form setup api post route.
Route::post('/forms', [FormController::class, 'store']);

