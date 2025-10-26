<?php

namespace App\Http\Controllers;

use App\Models\Hazard;
use App\Models\HazardType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class HazardController extends Controller
{
    public function map()
    {
        $hazards = Hazard::with('hazardType', 'user')->get();

        return Inertia::render('Map/Map', [
            'hazards' => $hazards,
            'hazardTypes' => HazardType::orderBy('name')->get(),
        ]);
    }

    public function index()
    {
        $hazards = Hazard::with('hazardType', 'user')
            ->latest()
            ->paginate(50);

        return Inertia::render('Hazards', [
            'hazards' => $hazards,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'description' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'severity' => 'required|in:1,2,3,4,5',
            'hazard_type_id' => 'required|exists:hazard_types,id',
        ]);

        $data['user_id'] = Auth::id();
        $data['status'] = 'open';

        Hazard::create($data);

        // optional: log activity here

        return back()->with('success', 'Hazard pinned successfully.');
    }

    public function update(Request $request, Hazard $hazard)
    {
        $data = $request->validate([
            'status' => 'required|in:open,resolved',
        ]);

        $hazard->update($data);

        // optional: log activity here

        return back()->with('success', 'Hazard updated.');
    }

    public function destroy(Hazard $hazard)
    {
        $hazard->delete();

        // optional: log activity here

        return back()->with('success', 'Hazard deleted.');
    }
}
