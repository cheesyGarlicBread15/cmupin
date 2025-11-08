import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function MemberView({ household, availableHouseholds }) {
    const [joinHouseholdId, setJoinHouseholdId] = useState('');
    const [createData, setCreateData] = useState({ name: '', address: '', lat: '', long: '' });

    if (!household) {
        return (
            <AppLayout>

                <div className="p-6 text-gray-900 dark:text-gray-100 min-h-screen">
                    <h1 className="text-2xl font-bold mb-4">Join or Create Household</h1>

                    {/* Join */}
                    <div className="mb-6">
                        <h2 className="font-semibold mb-2">Join Existing Household</h2>
                        <select
                            value={joinHouseholdId}
                            onChange={(e) => setJoinHouseholdId(e.target.value)}
                            className="border rounded px-3 py-2 w-full max-w-sm mb-2"
                        >
                            <option value="">Select Household</option>
                            {availableHouseholds.map((h) => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => router.post(route('households.request.join'), { household_id: joinHouseholdId })}
                            className="px-4 py-2 bg-red-600 text-white rounded"
                            disabled={!joinHouseholdId}
                        >
                            Request Join
                        </button>
                    </div>

                    {/* Create */}
                    <div>
                        <h2 className="font-semibold mb-2">Create New Household</h2>
                        <input type="text" placeholder="Name" className="border rounded px-3 py-2 w-full max-w-sm mb-2"
                            value={createData.name} onChange={e => setCreateData({ ...createData, name: e.target.value })} />
                        <input type="text" placeholder="Address" className="border rounded px-3 py-2 w-full max-w-sm mb-2"
                            value={createData.address} onChange={e => setCreateData({ ...createData, address: e.target.value })} />
                        <input type="text" placeholder="Latitude" className="border rounded px-3 py-2 w-full max-w-sm mb-2"
                            value={createData.lat} onChange={e => setCreateData({ ...createData, lat: e.target.value })} />
                        <input type="text" placeholder="Longitude" className="border rounded px-3 py-2 w-full max-w-sm mb-2"
                            value={createData.long} onChange={e => setCreateData({ ...createData, long: e.target.value })} />
                        <button
                            onClick={() => router.post(route('households.request.create'), createData)}
                            className="px-4 py-2 bg-red-600 text-white rounded"
                        >
                            Request Create
                        </button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <div className="p-6 text-gray-900 dark:text-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">{household.name}</h1>
            <p className="mb-2">Address: {household.address}</p>
            <p className="mb-2">Members:</p>
            <ul className="list-disc ml-6">
                {household.members.map(m => <li key={m.id}>{m.name}</li>)}
            </ul>
        </div>
    );
}
