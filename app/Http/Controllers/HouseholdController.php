<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HouseholdController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'all');

        $query = Household::latest();

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $households = $query->paginate(10)->appends(['status' => $status]);

        $users = User::role('member')->orderBy('name')->get();

        return Inertia::render('Households/Index', [
            'households' => $households,
            'filters' => [
                'status' => $status ?? 'safe',
            ],
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        // dd($request);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'lat' => 'required|numeric|between:-90,90',
            'long' => 'required|numeric|between:-180,180',
            'status' => 'nullable|in:safe,at_risk,need_rescue,evacuated',
            'user_id' => 'required|numeric',
        ]);

        $data['status'] = $data['status'] ?? 'safe';

        Household::create($data);

        $userToPromote = User::find($data['user_id']);

        $userToPromote->syncRoles('leader');

        return back()->with('success', 'Household created successfully.');
    }

    public function update(Request $request, Household $household)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'lat' => 'sometimes|numeric|between:-90,90',
            'long' => 'sometimes|numeric|between:-180,180',
            'status' => 'sometimes|in:safe,at_risk,need_rescue,evacuated',
        ]);

        $household->update($data);

        return back()->with('success', 'Household updated successfully.');
    }

    public function destroy(Household $household)
    {
        $household->delete();

        return back()->with('success', 'Household deleted successfully.');
    }
}
