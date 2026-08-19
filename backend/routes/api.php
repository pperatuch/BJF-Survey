<?php

use App\Http\Controllers\SurveyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('survey')->group(function () {
    Route::post('/verify-code', [SurveyController::class, 'verifyCode']);
    Route::post('/submit', [SurveyController::class, 'submit']);
});
