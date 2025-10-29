<?php

use App\Http\Controllers\MapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HazardController;
use App\Http\Controllers\ActivityLogController;

// TODO: household system
// TODO: logs

Route::get('/', fn() => Inertia::render('Auth/Login'));

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))
        ->middleware('role:admin|leader|member')
        ->name('dashboard');

    Route::get('/map', [MapController::class, 'index'])
        ->name('map');

    Route::prefix('/hazards')->name('hazards.')->group(function () {
        Route::get('/', [HazardController::class, 'index'])
            ->name('index');

        Route::post('/', [HazardController::class, 'store'])
            ->name('store');

        Route::patch('/{hazard}', [HazardController::class, 'update'])
            ->name('update');

        Route::delete('/{hazard}', [HazardController::class, 'destroy'])
            ->middleware('role:admin')
            ->name('destroy');
    });


    // Admin logs page
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/activity-logs', [ActivityLogController::class, 'index'])
            ->name('admin.logs');
    });

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
