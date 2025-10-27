import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function HazardReportModal({ show, onClose, coordinates }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        hazard_type_id: '',
        severity: 3,
        latitude: coordinates?.lat || '',
        longitude: coordinates?.lng || '',
    });

    useEffect(() => {
        if (coordinates) {
            setData('latitude', coordinates.lat);
            setData('longitude', coordinates.lng);
        }
    }, [coordinates]);

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
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        📍 Report Hazard
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <textarea
                            rows="3"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Latitude
                            </label>
                            <input
                                type="text"
                                value={data.latitude}
                                readOnly
                                className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Longitude
                            </label>
                            <input
                                type="text"
                                value={data.longitude}
                                readOnly
                                className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Severity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Severity (1–5)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={data.severity}
                            onChange={(e) => setData('severity', e.target.value)}
                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        />
                        {errors.severity && (
                            <p className="text-red-500 text-sm mt-1">{errors.severity}</p>
                        )}
                    </div>

                    {/* Hazard Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Hazard Type
                        </label>
                        <select
                            value={data.hazard_type_id}
                            onChange={(e) => setData('hazard_type_id', e.target.value)}
                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">Select hazard type</option>
                            <option value="1">Flood</option>
                            <option value="2">Landslide</option>
                            <option value="3">Earthquake</option>
                            <option value="4">Fire</option>
                        </select>
                        {errors.hazard_type_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.hazard_type_id}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end mt-6 space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            {processing ? 'Submitting...' : 'Submit Hazard'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
