import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function LeaderView({ household, requests }) {
    const [confirmModal, setConfirmModal] = useState({ open: false, type: null, payload: null });
    const [statusModal, setStatusModal] = useState({ open: false, status: household?.status ?? 'safe' });

    if (!household) {
        return (
            <div className="p-6 text-center text-gray-400">
                You don't have an assigned household yet.
            </div>
        );
    }

    const openConfirm = (type, payload) => setConfirmModal({ open: true, type, payload });
    const closeConfirm = () => setConfirmModal({ open: false, type: null, payload: null });

    const approveJoin = (requestId) => {
        router.patch(route('households.requests.approve', requestId), {}, { onSuccess: () => window.location.reload() });
    };

    const denyJoin = (requestId) => {
        router.patch(route('households.requests.deny', requestId), {}, { onSuccess: () => window.location.reload() });
    };

    const removeMember = (userId) => {
        router.delete(route('households.members.remove', userId), { onSuccess: () => window.location.reload() });
    };

    const saveStatus = () => {
        router.post(route('households.change-status', household.id), { status: statusModal.status }, {
            onSuccess: () => setStatusModal({ ...statusModal, open: false })
        });
    };

    const statusColors = {
        safe: 'bg-green-600',
        at_risk: 'bg-yellow-500',
        need_rescue: 'bg-red-500',
        evacuated: 'bg-blue-500'
    };

    return (
        <AppLayout>
            <div className="p-4 md:p-6 space-y-6">
                {/* Household Info Card */}
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 md:p-6 shadow-lg flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:shadow-red-500/30 transition-all">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-white break-words">{household.name}</h2>
                        <p className="text-gray-400 text-sm break-words">{household.address}</p>
                        <p className="mt-2 text-gray-400 text-sm">
                            Leader:{' '}
                            <span className="text-white font-medium">{household.leader.name}</span>
                        </p>
                        <p className="text-gray-400 text-sm">
                            Members:{' '}
                            <span className="text-white font-medium">{household.members?.length ?? 0}</span>
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <select
                            value={statusModal.status}
                            onChange={(e) =>
                                setStatusModal({ ...statusModal, status: e.target.value })
                            }
                            className="rounded-lg px-3 py-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto"
                        >
                            {Object.keys(statusColors).map((s) => (
                                <option key={s} value={s}>
                                    {s.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => setStatusModal({ ...statusModal, open: true })}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition w-full sm:w-auto"
                        >
                            Save
                        </button>
                    </div>
                </div>

                {/* Members & Requests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Members List */}
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-lg hover:shadow-red-500/20 transition-all overflow-hidden">
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
                            Members
                        </h3>
                        {household.members && household.members.length > 0 ? (
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                                {household.members.map((m) => (
                                    <div
                                        key={m.id}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gray-800 rounded-lg shadow-sm hover:bg-gray-700 transition"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">
                                                {m.name}
                                            </p>
                                            <p className="text-gray-400 text-sm truncate">
                                                {m.email}
                                            </p>
                                        </div>
                                        {m.id !== household.user_id && (
                                            <button
                                                onClick={() => openConfirm('remove', m)}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition w-full sm:w-auto"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No members yet.</p>
                        )}
                    </div>

                    {/* Pending Join Requests */}
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-lg hover:shadow-red-500/20 transition-all overflow-hidden">
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
                            Pending Join Requests
                        </h3>
                        {requests && requests.length > 0 ? (
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                                {requests.map((r) => (
                                    <div
                                        key={r.id}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gray-800 rounded-lg shadow-sm hover:bg-gray-700 transition"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">
                                                {r.user?.name}
                                            </p>
                                            <p className="text-gray-400 text-sm truncate">
                                                {r.user?.email}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => approveJoin(r.id)}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition flex-1 sm:flex-none"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => denyJoin(r.id)}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition flex-1 sm:flex-none"
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No pending join requests.</p>
                        )}
                    </div>
                </div>

                {/* Remove Confirmation Modal */}
                {confirmModal.open && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
                        <div
                            className="bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold text-white mb-3">
                                Remove member?
                            </h3>
                            <p className="text-gray-400 mb-4 text-sm">
                                Are you sure you want to remove{' '}
                                <strong className="text-white">
                                    {confirmModal.payload?.name}
                                </strong>{' '}
                                from this household?
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={closeConfirm}
                                    className="px-3 py-1 border border-gray-700 rounded-lg text-gray-300 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        removeMember(confirmModal.payload.id);
                                        closeConfirm();
                                    }}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Confirmation Modal */}
                {statusModal.open && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
                        <div
                            className="bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold text-white mb-3">
                                Confirm Status Change
                            </h3>
                            <p className="text-gray-400 mb-4 text-sm">
                                Set household status to{' '}
                                <span
                                    className={`px-2 py-1 rounded text-white text-sm ${statusColors[statusModal.status]}`}
                                >
                                    {statusModal.status.replace('_', ' ')}
                                </span>
                                ?
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() =>
                                        setStatusModal({ ...statusModal, open: false })
                                    }
                                    className="px-3 py-1 border border-gray-700 rounded-lg text-gray-300 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveStatus}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium text-sm"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
