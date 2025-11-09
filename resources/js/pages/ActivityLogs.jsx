import React from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function ActivityLogs({ logs }) {
    return (
        <AppLayout>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-5">Activity Logs</h1>
                </div>

                <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Time</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">User Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Role</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Phone</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {logs.data.map(log => (
                                <tr
                                    key={log.id}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {log.user ? log.user.name : 'System'}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {log.user ? (
                                            <div className="flex flex-wrap gap-1">
                                                {log.user.roles.map(role => {
                                                    const roleName = role.name.charAt(0).toUpperCase() + role.name.slice(1);
                                                    let colorClass = 'bg-gray-500';
                                                    if (role.name.toLowerCase() === 'admin') colorClass = 'bg-blue-500';
                                                    else if (role.name.toLowerCase() === 'member') colorClass = 'bg-green-500';
                                                    else if (role.name.toLowerCase() === 'leader') colorClass = 'bg-yellow-400';

                                                    return (
                                                        <span
                                                            key={role.id}
                                                            className={`${colorClass} text-white text-xs font-semibold rounded-full px-2 py-1`}
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
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{log.user ? log.user.phone_number : '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{log.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400 gap-3">
                    <div>
                        Showing {logs.from || 0}–{logs.to || 0} of {logs.total || 0}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {logs.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 rounded-full border transition-all duration-200 ${link.active
                                    ? 'bg-red-600 text-white border-red-600 shadow-md'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
