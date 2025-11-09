import React, { useState, useMemo, useEffect } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MemberView({ availableHouseholds = [], pendingRequests = [] }) {
    const [search, setSearch] = useState("");
    const [selectedHousehold, setSelectedHousehold] = useState("");
    const [createData, setCreateData] = useState({ name: "", address: "", lat: "", long: "" });
    const [mapInstance, setMapInstance] = useState(null);
    const [marker, setMarker] = useState(null);

    // Filter join search
    const filtered = useMemo(() => {
        if (!search) return availableHouseholds;
        return availableHouseholds.filter((h) =>
            h.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, availableHouseholds]);

    // Leaflet map init
    useEffect(() => {
        if (!mapInstance) {
            const map = L.map("map").setView([7.1907, 125.4553], 8); // default Davao City
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            map.on("click", (e) => {
                const lat = e.latlng.lat.toFixed(8);
                const lng = e.latlng.lng.toFixed(8);
                setCreateData((prev) => ({ ...prev, lat, long: lng }));

                if (marker) {
                    marker.setLatLng(e.latlng);
                } else {
                    const newMarker = L.marker(e.latlng).addTo(map);
                    setMarker(newMarker);
                }
            });

            setMapInstance(map);
        }
    }, [mapInstance, marker]);

    // Join submit
    const submitJoin = (e) => {
        e.preventDefault();
        if (!selectedHousehold) return;

        router.post(route("households.request.join"), { household_id: selectedHousehold }, {
            onSuccess: () => {
                // Optionally refresh the page or reset selection
                setSelectedHousehold("");
            },
            onError: (err) => {
                console.log("Join request failed:", err);
            }
        });
    };

    // Create submit
    const submitCreate = (e) => {
        e.preventDefault();
        router.post(route("households.request.create"), createData, {
            onSuccess: () => setCreateData({ name: "", address: "", lat: "", long: "" }),
            onError: (err) => console.log("Create request failed:", err),
        });
    };

    const hasPendingCreate = pendingRequests.some(
        (r) => r.type === "create" && r.status === "pending"
    );
    const hasPendingJoinFor = (householdId) =>
        pendingRequests.some(
            (r) => r.type === "join" && r.household_id === householdId && r.status === "pending"
        );
    
    return (
        <AppLayout>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* JOIN SECTION */}
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

                        <form onSubmit={submitJoin} className="space-y-3">
                            <select
                                value={selectedHousehold}
                                onChange={(e) => setSelectedHousehold(e.target.value)}
                                className="w-full rounded-lg px-4 py-2 bg-gray-800 border border-gray-700 text-white"
                            >
                                <option value="">Select household</option>
                                {filtered.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.name} — {h.address}
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

                {/* CREATE SECTION */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-lg rounded-2xl p-6 hover:shadow-red-600/20 transition-all">
                    <h2 className="text-xl font-bold text-white">Request to Create a Household</h2>
                    <p className="text-gray-400 text-sm mt-1">Create your own household if none exists. Admin will review and approve.</p>

                    {hasPendingCreate ? (
                        <div className="mt-6 p-4 bg-gray-800 rounded-lg text-gray-400 text-sm">
                            You already have a pending create request.
                        </div>
                    ) : (
                        <form onSubmit={submitCreate} className="mt-4 space-y-4">
                            <input
                                value={createData.name}
                                onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                                required
                                placeholder="Household Name"
                                className="w-full rounded-lg px-4 py-2 bg-gray-800 border border-gray-700 text-white"
                            />
                            <input
                                value={createData.address}
                                onChange={(e) => setCreateData({ ...createData, address: e.target.value })}
                                required
                                placeholder="Address"
                                className="w-full rounded-lg px-4 py-2 bg-gray-800 border border-gray-700 text-white"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    value={createData.lat}
                                    readOnly
                                    placeholder="Latitude"
                                    className="rounded-lg px-3 py-2 bg-gray-800 border border-gray-700 text-white"
                                />
                                <input
                                    value={createData.long}
                                    readOnly
                                    placeholder="Longitude"
                                    className="rounded-lg px-3 py-2 bg-gray-800 border border-gray-700 text-white"
                                />
                            </div>

                            <div id="map" className="mt-4 h-64 rounded-xl border border-gray-700"></div>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition"
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
