<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('Home'));
Route::get('/map', fn() => Inertia::render('Map'));
Route::get('/profile', fn() => Inertia::render('Profile'));
