import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";

export default function MemberView({ household, availableHouseholds = [], pendingRequests = [] }) {
    const [statusModal, setStatusModal] = useState({ open: false, status: household?.status ?? "safe" });
    const [search, setSearch] = useState("");
    const [selectedHousehold, setSelectedHousehold] = useState("");

    const filtered = availableHouseholds.filter((h) =>
        h.name.toLowerCase().includes(search.toLowerCase())
    );

    const saveStatus = () => {
        router.post(
            route("households.change-status", household.id),
            { status: statusModal.status },
            {
                onSuccess: () => setStatusModal({ ...statusModal, open: false }),
            }
        );
    };

    const hasPendingJoinFor = (householdId) =>
        pendingRequests.some(
            (r) => r.type === "join" && r.household_id === householdId && r.status === "pending"
        );

    const statusColors = {
        safe: "bg-green-600",
        at_risk: "bg-yellow-500",
        need_rescue: "bg-red-500",
        evacuated: "bg-blue-500",
    };

    // If the member is in a household, view household details
    if (household) {
        return (
            <AppLayout>
                <div className="p-6 space-y-6">
                    {/* Household Info Card */}
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:shadow-red-500/30 transition-all">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{household.name}</h2>
                            <p className="text-gray-400 mt-1">{household.address}</p>
                            <p className="mt-2 text-gray-400">
                                Leader: <span className="text-white font-medium">{household.leader.name}</span>
                            </p>
                            <p className="mt-1 text-gray-400">
                                Members: <span className="text-white font-medium">{household.members?.length ?? 0}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={statusModal.status}
                                onChange={(e) => setStatusModal({ ...statusModal, status: e.target.value })}
                                className="rounded-lg px-3 py-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                {Object.keys(statusColors).map((s) => (
                                    <option key={s} value={s}>
                                        {s.replace("_", " ")}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => setStatusModal({ ...statusModal, open: true })}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-lg space-y-4 hover:shadow-red-500/20 transition-all">
                        <h3 className="text-xl font-semibold text-white mb-4">Members</h3>
                        {household.members && household.members.length > 0 ? (
                            <div className="space-y-2">
                                {household.members.map((m) => (
                                    <div
                                        key={m.id}
                                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg shadow-sm hover:bg-gray-700 transition"
                                    >
                                        <div>
                                            <p className="text-white font-medium">{m.name}</p>
                                            <p className="text-gray-400 text-sm">{m.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No members yet.</p>
                        )}
                    </div>

                    {/* Status Confirmation Modal */}
                    {statusModal.open && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                            <div
                                className="bg-gray-900 p-6 rounded-2xl shadow-lg w-80"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-lg font-semibold text-white mb-3">Confirm Status Change</h3>
                                <p className="text-gray-400 mb-4">
                                    Set household status to{" "}
                                    <span
                                        className={`px-2 py-1 rounded text-white ${statusColors[statusModal.status]}`}
                                    >
                                        {statusModal.status.replace("_", " ")}
                                    </span>
                                    ?
                                </p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setStatusModal({ ...statusModal, open: false })}
                                        className="px-3 py-1 border border-gray-700 rounded-lg text-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveStatus}
                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium"
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

    // If the member is not in a household, join/create form
    return (
        <AppLayout>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Join */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-lg rounded-2xl p-6 hover:shadow-red-600/20 transition-all">
                    <h2 className="text-xl font-bold text-white">Join an Existing Household</h2>
                    <p className="text-gray-400 text-sm mt-1">Search for your neighborhood household and send a join request.</p>

                    <div className="mt-4 space-y-4">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="🔍 Search households..."
                            className="w-full rounded-lg px-4 py-2 bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-red-600 outline-none"
                        />

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!selectedHousehold) return;
                                router.post(route("households.request.join"), { household_id: selectedHousehold });
                                setSelectedHousehold("");
                            }}
                            className="space-y-3"
                        >
                            <select
                                value={selectedHousehold}
                                onChange={(e) => setSelectedHousehold(e.target.value)}
                                className="w-full rounded-lg px-4 py-2 bg-gray-800 border border-gray-700 text-white"
                            >
                                <option value="">Select household</option>
                                {filtered.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                disabled={!selectedHousehold}
                                className={`w-full py-2 rounded-lg font-medium transition ${selectedHousehold
                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                Send Join Request
                            </button>

                            {selectedHousehold && hasPendingJoinFor(selectedHousehold) && (
                                <div className="text-sm text-gray-400 text-center">Pending Approval...</div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Create */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-lg rounded-2xl p-6 hover:shadow-red-600/20 transition-all">
                    <h2 className="text-xl font-bold text-white">Request to Create a Household</h2>
                    <p className="text-gray-400 text-sm mt-1">Create your own household if none exists. Admin will review and approve.</p>

                    {pendingRequests.some((r) => r.type === "create" && r.status === "pending") ? (
                        <div className="mt-6 p-4 bg-gray-800 rounded-lg text-gray-400 text-sm">
                            You already have a pending create request.
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.post(route("households.request.create"), {
                                    name: e.target.name.value,
                                    address: e.target.address.value,
                                });
                                e.target.reset();
                            }}
                            className="mt-4 space-y-4"
                        >
                            <input
                                name="name"
                                required
                                placeholder="Household Name"
                                className="w-full rounded-lg px-4 py-2 bg-gray-800 border border-gray-700 text-white"
                            />
                            <input
                                name="address"
                                required
                                placeholder="Address"
                                className="w-full rounded-lg px-4 py-2 bg-gray-800 border border-gray-700 text-white"
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="w-full px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition"
                                >
                                    Submit Create Request
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
