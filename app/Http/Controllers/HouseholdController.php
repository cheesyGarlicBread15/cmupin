<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\User;
use App\Models\HouseholdRequest;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class HouseholdController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        $status = $request->get('status', 'all');
        // Admin
        if ($user->hasRole('admin')) {
            $households = Household::withCount('members')->latest()
                ->when($status !== 'all', fn($q) => $q->where('status', $status))
                ->paginate(10)
                ->appends(['status' => $status]);

            $users = User::role('member')->orderBy('name')->get();

            $requests = HouseholdRequest::with(['user', 'household'])
                ->where('status', 'pending')
                ->latest()
                ->paginate(10);

            return Inertia::render('Households/Views/AdminView', [
                'households' => $households,
                'filters' => ['status' => $status],
                'users' => $users,
                'requests' => $requests,
            ]);
        }

        // Leader
        if ($user->hasRole('leader')) {
            $household = Household::with(['members', 'leader'])->where('user_id', $user->id)->first();
            $requests = HouseholdRequest::with('user')
                ->where('household_id', $household?->id)
                ->where('type', 'join')
                ->where('status', 'pending')
                ->latest()
                ->get();
            return Inertia::render('Households/Views/LeaderView', [
                'household' => $household,
                'requests' => $requests,
            ]);
        }

        // --- Member view ---
        if ($user->hasRole('member')) {
            $household = Household::with(['members', 'leader'])->find($user->household_id);

            if (!$household) {
                $availableHouseholds = Household::select('id', 'name')->orderBy('name')->get();
                return Inertia::render('Households/Views/MemberView', [
                    'availableHouseholds' => $availableHouseholds,
                ]);
            }

            return Inertia::render('Households/Views/MemberView', [
                'household' => $household,
            ]);
        }

        abort(403);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'lat' => 'required|numeric|between:-90,90',
            'long' => 'required|numeric|between:-180,180',
            'status' => 'nullable|in:safe,at_risk,need_rescue,evacuated',
            'user_id' => 'required|numeric|exists:users,id',
        ]);

        $data['status'] = $data['status'] ?? 'safe';
        $household = Household::create($data);

        $userToPromote = User::find($data['user_id']);
        $userToPromote->update(['household_id' => $household->id]);
        $userToPromote->syncRoles('leader');

        ActivityLogger::log('Household created');

        return back()->with('success', 'Household created successfully.');
    }

    // Update household
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

        ActivityLogger::log('Household status updated');

        return back()->with('success', 'Household updated successfully.');
    }

    // Delete household
    public function destroy(Household $household)
    {
        foreach ($household->members as $member) {
            $member->update(['household_id' => null]);
            if ($member->hasRole('leader')) $member->syncRoles('member');
        }
        $household->delete();

        ActivityLogger::log('Household deleted');

        return back()->with('success', 'Household deleted successfully.');
    }

    // -------------------
    // Request Management
    // -------------------

    public function requestJoin(Request $request)
    {
        $user = Auth::user();
        $data = $request->validate(['household_id' => 'required|exists:households,id']);

        HouseholdRequest::create([
            'user_id' => $user->id,
            'household_id' => $data['household_id'],
            'type' => 'join',
            'status' => 'pending',
        ]);

        ActivityLogger::log('Submitted join request');

        return back()->with('success', 'Join request sent successfully.');
    }

    public function requestCreate(Request $request)
    {
        $user = Auth::user();
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'lat' => 'required|numeric|between:-90,90',
            'long' => 'required|numeric|between:-180,180',
        ]);

        HouseholdRequest::create([
            'user_id' => $user->id,
            'household_id' => null,
            'type' => 'create',
            'status' => 'pending',
            'meta' => json_encode($data),
        ]);

        ActivityLogger::log('Submitted create request');

        return back()->with('success', 'Create household request submitted.');
    }

    public function approveRequest(HouseholdRequest $householdRequest)
    {
        if ($householdRequest->type === 'join') {
            $householdRequest->update(['status' => 'approved']);
            $householdRequest->user->update(['household_id' => $householdRequest->household_id]);
        } else if ($householdRequest->type === 'create') {
            $meta = json_decode($householdRequest->meta, true);
            $household = Household::create(array_merge($meta, ['status' => 'safe']));
            $user = $householdRequest->user;
            $household->update(['user_id' => $user->id]);
            $user->update(['household_id' => $household->id]);
            $user->syncRoles('leader');
            $householdRequest->update(['status' => 'approved', 'household_id' => $household->id]);
        }

        ActivityLogger::log('Approved request');

        return back()->with('success', 'Request approved.');
    }

    public function denyRequest(HouseholdRequest $householdRequest)
    {
        $householdRequest->update(['status' => 'denied']);

        ActivityLogger::log('Denied request');

        return back()->with('success', 'Request denied.');
    }

    public function removeMember(User $user)
    {
        /** @var User $actor */
        $actor = Auth::user();

        if (!$actor->hasRole('leader') || $actor->household_id !== $user->household_id) {
            abort(403);
        }

        if ($user->id === $actor->id) {
            return back()->with('warning', 'Leader cannot remove themselves here.');
        }

        $user->update(['household_id' => null]);
        if ($user->hasRole('leader')) {
            $user->syncRoles('member');
        }

        ActivityLogger::log('Member removed');

        return back()->with('success', 'Member removed from household.');
    }

    public function changeStatus(Request $request, Household $household)
    {
        $user = Auth::user();

        if ($user->household_id !== $household->id) {
            abort(403);
        }

        $data = $request->validate([
            'status' => ['required', Rule::in(['safe', 'at_risk', 'need_rescue', 'evacuated'])],
        ]);

        $household->update(['status' => $data['status']]);

        ActivityLogger::log('Changed household status');

        return back()->with('success', 'Household status updated.');
    }
}
