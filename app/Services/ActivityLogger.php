<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    public static function log(string $action, $subject = null, array $meta = [])
    {
        $user = Auth::user();

        return ActivityLog::create([
            'user_id' => $user ? $user->id : null,
            'action' => $action,
        ]);
    }
}
