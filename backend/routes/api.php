<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\SurveyResponseController;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Public Survey Routes (For Employees answering survey)
Route::prefix('survey')->group(function () {
    Route::post('/verify-code', [SurveyController::class, 'verifyCode']);
    Route::post('/submit', [SurveyController::class, 'submit']);
});

// Protected Routes (For Admins using Stateless JWT)
Route::middleware('auth.jwt')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Group routes that require explicit Admin role authorization
    Route::middleware('admin')->group(function () {
        Route::get('/survey/responses', [SurveyResponseController::class, 'index']);
        Route::get('/survey/responses/summary', [SurveyResponseController::class, 'summary']);
        Route::get('/survey/responses/export', [SurveyResponseController::class, 'exportExcel']);
        Route::get('/survey/access-codes/export', [SurveyResponseController::class, 'exportAccessCodes']);
    });
});

