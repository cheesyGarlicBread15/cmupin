<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = ActivityLog::with('user.roles')->latest()->paginate(10);

        return Inertia::render('ActivityLogs', [
            'logs' => $logs,
        ]);
    }
}
