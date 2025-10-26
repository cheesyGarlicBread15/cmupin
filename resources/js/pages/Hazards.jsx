import { useEffect, useState } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/AppLayout';

export default function HazardsPage() {
    const [tab, setTab] = useState('open'); // open | resolved | all
    const [hazards, setHazards] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHazards = async (status) => {
        setLoading(true);
        try {
            const params = { per_page: 'all' };
            if (status !== 'all') params.status = status;
            const res = await axios.get('/api/hazards', { params });
            setHazards(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHazards(tab);
    }, [tab]);

    return (
        <AppLayout>
            <div className="p-6 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Hazards</h1>

                <div className="flex gap-2 mb-4">
                    {['open', 'resolved', 'all'].map((status) => (
                        <button
                            key={status}
                            className={`px-3 py-2 rounded border border-gray-300 dark:border-gray-700 transition 
                                ${tab === status
                                    ? 'bg-gray-200 dark:bg-gray-700 font-semibold'
                                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750'
                                }`}
                            onClick={() => setTab(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="space-y-4">
                        {hazards.length === 0 && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">No hazards found.</div>
                        )}
                        {hazards.map((h) => (
                            <div
                                key={h.id}
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <div className="font-semibold text-lg">{h.title || h.type?.name}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            {h.type?.name} • Severity {h.severity} • {h.status}
                                        </div>
                                        <div className="text-sm mt-2">{h.description}</div>
                                    </div>
                                    <div className="text-right text-xs text-gray-600 dark:text-gray-400">
                                        <div>Reporter: {h.user?.name}</div>
                                        <div>{h.user?.phone_number}</div>
                                        <div className="mt-2">{new Date(h.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
