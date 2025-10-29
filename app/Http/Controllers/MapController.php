<?php

namespace App\Http\Controllers;

use App\Models\Hazard;
use App\Models\HazardType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        $hazards = Hazard::with('hazardType', 'user')->where('status', 'open')->get();

        return Inertia::render('Map/Map', [
            'hazards' => $hazards,
            'hazardTypes' => HazardType::all(),
        ]);
    }
}
