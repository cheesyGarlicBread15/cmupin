import React from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function LeaderView({ household, requests }) {
    return (
        <AppLayout>
            <div className="p-6 text-gray-900 dark:text-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold mb-4">{household.name}</h1>
                <p className="mb-4">Members:</p>
                <ul className="list-disc ml-6 mb-6">
                    {household.members.map(m => <li key={m.id}>{m.name}</li>)}
                </ul>

                <h2 className="text-xl font-semibold mb-2">Pending Join Requests</h2>
                {requests.length === 0 && <p>No join requests pending.</p>}
                {requests.length > 0 && (
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700/50 text-left">
                                <th className="px-4 py-2">User</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(r => (
                                <tr key={r.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-4 py-2">{r.user.name}</td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <button
                                            className="px-3 py-1 bg-green-600 text-white rounded"
                                            onClick={() => router.patch(route('households.requests.approve', r.id))}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-600 text-white rounded"
                                            onClick={() => router.patch(route('households.requests.deny', r.id))}
                                        >
                                            Deny
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AppLayout>
    );
}
