import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function HazardReportModal({ show, onClose, coordinates, hazardTypes }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        description: '',
        hazard_type_id: '',
        severity: 3,
        latitude: coordinates?.lat || '',
        longitude: coordinates?.lng || '',
    });

    const modalRef = useRef(null);

    useEffect(() => {
        if (coordinates) {
            setData('latitude', coordinates.lat);
            setData('longitude', coordinates.lng);
        }
    }, [coordinates]);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        if (show) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [show, onClose]);

    const submit = (e) => {
        e.preventDefault();
        post(route('hazards.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            style={{
                animation: 'fadeIn 0.2s ease-out',
            }}
        >
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg p-6 sm:p-8 transition-all duration-200"
                style={{
                    animation: 'fadeIn 0.25s ease-out',
                }}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-5 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <span className="text-red-500 text-2xl">📍</span>
                        Report Hazard
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-500 text-2xl leading-none transition"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-5">
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            rows="3"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Describe the hazard briefly..."
                            className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Latitude
                            </label>
                            <input
                                type="text"
                                value={data.latitude}
                                readOnly
                                className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 shadow-sm cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Longitude
                            </label>
                            <input
                                type="text"
                                value={data.longitude}
                                readOnly
                                className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 shadow-sm cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Severity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Severity
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((level) => {
                                const colors = {
                                    1: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400',
                                    2: 'bg-lime-100 text-lime-700 border-lime-300 dark:bg-lime-900/30 dark:text-lime-400',
                                    3: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400',
                                    4: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400',
                                    5: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400',
                                };

                                const isActive = data.severity == level;

                                return (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setData('severity', level)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-semibold transition
                        ${colors[level]} 
                        ${isActive ? 'ring-2 ring-offset-1 ring-red-500 scale-105' : 'opacity-80 hover:opacity-100'}
                    `}
                                    >
                                        {level}
                                    </button>
                                );
                            })}
                        </div>
                        {errors.severity && (
                            <p className="text-red-500 text-sm mt-1">{errors.severity}</p>
                        )}
                    </div>

                    {/* Hazard Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Hazard Type
                        </label>
                        <select
                            value={data.hazard_type_id}
                            onChange={(e) => setData('hazard_type_id', e.target.value)}
                            className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        >
                            <option value="">Select hazard type</option>
                            {hazardTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        {errors.hazard_type_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.hazard_type_id}</p>
                        )}
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
                            {processing ? 'Submitting...' : 'Submit Hazard'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Inline keyframes */}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                `}
            </style>
        </div>
    );
}
