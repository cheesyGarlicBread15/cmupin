<?php

use App\Http\Controllers\MapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HazardController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\DashboardController;

// TODO: logs

Route::get('/', fn() => Inertia::render('Auth/Login'));

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('role:admin|leader|member')
        ->name('dashboard');

    Route::get('/map', [MapController::class, 'index'])
        ->name('map');

    Route::prefix('/hazards')->name('hazards.')->group(function () {
        Route::get('/', [HazardController::class, 'index'])->middleware('role:admin')
            ->name('index');

        Route::post('/', [HazardController::class, 'store'])
            ->name('store');

        Route::patch('/{hazard}', [HazardController::class, 'update'])->middleware('role:admin')
            ->name('update');

        Route::delete('/{hazard}', [HazardController::class, 'destroy'])->middleware('role:admin')
            ->middleware('role:admin')
            ->name('destroy');
    });

    Route::prefix('/households')->name('households.')->group(function () {
        Route::get('/', [HouseholdController::class, 'index'])->name('index');
        Route::post('/', [HouseholdController::class, 'store'])->middleware('role:admin|leader')->name('store');
        Route::patch('/{household}', [HouseholdController::class, 'update'])->middleware('role:admin|leader')->name('update');
        Route::delete('/{household}', [HouseholdController::class, 'destroy'])->middleware('role:admin')->name('destroy');

        Route::patch('/requests/{householdRequest}/approve', [HouseholdController::class, 'approveRequest'])->middleware('role:admin|leader')->name('requests.approve');
        Route::patch('/requests/{householdRequest}/deny', [HouseholdController::class, 'denyRequest'])->middleware('role:admin|leader')->name('requests.deny');

        Route::delete('/members/{user}', [HouseholdController::class, 'removeMember'])->middleware('role:leader')->name('members.remove');
        Route::post('/{household}/change-status', [HouseholdController::class, 'changeStatus'])->middleware('role:leader|member')->name('change-status');

        Route::middleware('role:member')->group(function () {
            Route::post('/join', [HouseholdController::class, 'requestJoin'])->name('request.join');
            Route::post('/create', [HouseholdController::class, 'requestCreate'])->name('request.create');
        });
    });


    // Admin logs page
    Route::middleware('role:admin')->group(function () {
        Route::get('/activity-logs', [ActivityLogController::class, 'index'])
            ->name('admin.logs');
    });

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
