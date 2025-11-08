import { useEffect, useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function HouseholdFormModal({ show, onClose, mode = "create", household = null, users = [] }) {
    const modalRef = useRef(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: household?.name || "",
        address: household?.address || "",
        lat: household?.lat || "",
        long: household?.long || "",
        status: household?.status || "safe",
        user_id: household?.user_id || "",
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [markerPosition, setMarkerPosition] = useState(
        household ? { lat: household.lat, lng: household.long } : null
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);


    // ✅ Filter user list dynamically
    useEffect(() => {
        setFilteredUsers(
            users.filter((u) =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, users]);

    // ✅ Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        if (show) document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [show, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            name: data.name,
            address: data.address,
            lat: data.lat,
            long: data.long,
            status: data.status,
            user_id: data.user_id,
        };

        if (mode === "create") {
            post(route("households.store"), {
                data: payload,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            patch(route("households.update", household.id), {
                data: payload,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    // ✅ Map click event for coordinates
    const LocationSelector = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setMarkerPosition({ lat, lng });
                setData("lat", lat.toFixed(6));
                setData("long", lng.toFixed(6));
            },
        });
        return markerPosition ? <Marker position={markerPosition} /> : null;
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            style={{ animation: "fadeIn 0.2s ease-out" }}
        >
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 
                w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 transition-all duration-200"
                style={{ animation: "fadeIn 0.25s ease-out" }}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-5 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        🏠 {mode === "create" ? "Add New Household" : "Edit Household"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-500 text-2xl leading-none transition"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Address
                        </label>
                        <textarea
                            rows="2"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            required
                            className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                    </div>

                    {/* ✅ Real Searchable Dropdown (fixed selection behavior) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Assign to Member
                        </label>

                        <div className="relative">
                            {/* Dropdown button */}
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-full flex justify-between items-center px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500"
                            >
                                {data.user_id
                                    ? users.find((u) => u.id === data.user_id)?.name
                                    : "Select a member"}
                                <svg
                                    className={`w-4 h-4 ml-2 transform transition-transform ${dropdownOpen ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </button>

                            {/* Dropdown list */}
                            {dropdownOpen && (
                                <div className="absolute top-11 left-0 w-full max-h-56 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg z-[9999]">
                                    {/* Search input inside dropdown */}
                                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 px-2 py-1 text-sm focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>

                                    {/* Filtered users list */}
                                    <div className="max-h-48 overflow-y-auto">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setData("user_id", user.id);
                                                        setSearchQuery("");
                                                        setDropdownOpen(false); // close dropdown
                                                    }}
                                                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-red-100 dark:hover:bg-gray-700 ${data.user_id === user.id
                                                            ? "bg-red-50 dark:bg-gray-700"
                                                            : ""
                                                        }`}
                                                >
                                                    {user.name}
                                                </button>
                                            ))
                                        ) : (
                                            <p className="px-3 py-2 text-sm text-gray-500">
                                                No users found
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {errors.user_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>
                        )}
                    </div>

                    {/* Map Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select Location on Map
                        </label>
                        <div className="h-64 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
                            <MapContainer
                                center={markerPosition || [7.1907, 125.4553]}
                                zoom={12}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationSelector />
                            </MapContainer>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Click on the map to pin your household location.
                        </p>
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Latitude
                            </label>
                            <input
                                type="text"
                                value={data.lat}
                                readOnly
                                className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Longitude
                            </label>
                            <input
                                type="text"
                                value={data.long}
                                readOnly
                                className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition disabled:opacity-50"
                        >
                            {processing
                                ? "Saving..."
                                : mode === "create"
                                    ? "Create Household"
                                    : "Update Household"}
                        </button>
                    </div>
                </form>
            </div>

            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.96); }
                    to { opacity: 1; transform: scale(1); }
                }
                `}
            </style>
        </div>
    );
}
