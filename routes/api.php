<?php

use App\Http\Controllers\HazardController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->name('hazards.')->group(function () {
    Route::get('/hazards', [HazardController::class, 'index'])->name('index');
    Route::post('/hazards', [HazardController::class, 'store']);
    Route::get('/hazards/{hazard}', [HazardController::class, 'show']);
    Route::patch('/hazards/{hazard}', [HazardController::class, 'update']);
    Route::delete('/hazards/{hazard}', [HazardController::class, 'destroy']);

    Route::get('/hazard-types', function () {
        return \App\Models\HazardType::orderBy('name')->get();
});
});


