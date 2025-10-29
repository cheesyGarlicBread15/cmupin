<?php

namespace App\Http\Controllers;

use App\Models\Hazard;
use App\Models\HazardType;
use App\Models\User;
use App\Notifications\NewHazardAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class HazardController extends Controller
{
    public function map()
    {
        $hazards = Hazard::with('hazardType', 'user')->get();

        return Inertia::render('Map/Map', [
            'hazards' => $hazards,
            'hazardTypes' => HazardType::all(),
        ]);
    }

    public function index(Request $request)
    {
        $status = $request->get('status');

        $query = Hazard::with('hazardType', 'user')->latest();

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $hazards = $query->paginate(10);

        return Inertia::render('Hazards', [
            'hazards' => $hazards,
            'filters' => [
                'status' => $status ?? 'open',
            ],
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

        $hazard = Hazard::create($data);

        // Send alert to all users with emails
        $users = User::whereNotNull('email')->get();
        Notification::send($users, new NewHazardAlert($hazard));

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
