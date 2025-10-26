<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Hazard;

class HazardPolicy
{
    public function update(User $user, Hazard $hazard)
    {
        return $user->id === $hazard->user_id || $user->hasRole('admin');
    }

    public function delete(User $user, Hazard $hazard)
    {
        return $user->hasRole('admin');
    }

    public function viewAny(User $user)
    {
        return $user != null;
    }

    public function create(User $user)
    {
        return $user != null;
    }
}
