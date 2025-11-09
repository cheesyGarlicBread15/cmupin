import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function ActivityLogs({ logs }) {

    console.log(logs);

    return (
        <AppLayout>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Activity Logs</h1>

                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <thead>
                            <tr className="text-left bg-gray-100 dark:bg-gray-700">
                                <th className="p-2">Time</th>
                                <th className="p-2">User Name</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Phone</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.map(log => (
                                <tr
                                    key={log.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
                                    <td className="p-2">{log.user ? log.user.name : 'System'}</td>
                                    <td className="p-2">
                                        {log.user ? (
                                            <div className="flex flex-wrap gap-1">
                                                {log.user.roles.map(role => {
                                                    let colorClass = 'bg-gray-500'; // default
                                                    const roleName = role.name.charAt(0).toUpperCase() + role.name.slice(1); // capitalize first letter

                                                    if (role.name.toLowerCase() === 'admin') colorClass = 'bg-blue-500';
                                                    else if (role.name.toLowerCase() === 'member') colorClass = 'bg-green-500';
                                                    else if (role.name.toLowerCase() === 'leader') colorClass = 'bg-yellow-400';

                                                    return (
                                                        <span
                                                            key={role.id}
                                                            className={`${colorClass} text-white text-xs rounded-full px-2 py-1`}
                                                        >
                                                            {roleName}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="p-2">{log.user ? log.user.phone_number : '-'}</td>
                                    <td className="p-2">{log.action}</td>
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
