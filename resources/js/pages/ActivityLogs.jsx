import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function ActivityLogs() {
    const { props } = usePage();
    const logs = props.logs;

    return (
        <AppLayout>
            <div className="p-6 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>

                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <thead>
                            <tr className="text-left bg-gray-100 dark:bg-gray-700">
                                <th className="p-2">Time</th>
                                <th className="p-2">User ID</th>
                                <th className="p-2">Full Name</th>
                                <th className="p-2">Phone</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.map(l => (
                                <tr key={l.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                                    <td className="p-2">{new Date(l.created_at).toLocaleString()}</td>
                                    <td className="p-2">{l.user ? l.user.id : ''}</td>
                                    <td className="p-2">{l.user ? l.user.name : 'system'}</td>
                                    <td className="p-2">{l.user ? l.user.phone_number : ''}</td>
                                    <td className="p-2">{l.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex gap-2">
                    {logs.prev_page_url && (
                        <a
                            href={logs.prev_page_url}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Previous
                        </a>
                    )}
                    {logs.next_page_url && (
                        <a
                            href={logs.next_page_url}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Next
                        </a>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
