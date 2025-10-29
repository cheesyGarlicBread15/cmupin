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
            'subject_type' => $subject ? (is_object($subject) ? get_class($subject) : null) : null,
            'subject_id' => $subject && is_object($subject) && isset($subject->id) ? $subject->id : null,
            'meta' => $meta ?: null,
        ]);
    }
}
