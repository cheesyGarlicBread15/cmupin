<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\Hazard;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Household stats
        $totalHouseholds = Household::count();
        $safe = Household::where('status', 'safe')->count();
        $atRisk = Household::where('status', 'at_risk')->count();
        $needRescue = Household::where('status', 'need_rescue')->count();
        $evacuated = Household::where('status', 'evacuated')->count();

        // Hazard stats
        $hazardStats = Hazard::with('hazardType')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total' => $totalHouseholds,
                'safe' => $safe,
                'atRisk' => $atRisk,
                'needRescue' => $needRescue,
                'evacuated' => $evacuated,
            ],
            'hazards' => $hazardStats,
        ]);
    }
}
