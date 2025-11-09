import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function Hazards({ hazards, filters }) {
    const [tab, setTab] = useState(filters.status || 'open');
    const [modal, setModal] = useState({ open: false, action: null, hazardId: null });

    const handleTabChange = (status) => {
        setTab(status);
        router.get(route('hazards.index'), { status }, { preserveState: true, replace: true });
    };

    const confirmAction = (action, hazardId) => {
        setModal({ open: true, action, hazardId });
    };

    const performAction = () => {
        const { action, hazardId } = modal;

        if (action === 'delete') {
            router.delete(route('hazards.destroy', hazardId), {
                preserveScroll: true,
                onSuccess: () => {
                    // Instantly remove from table for better UX
                    hazards.data = hazards.data.filter(h => h.id !== hazardId);
                },
            });
        } else if (action === 'resolve') {
            router.patch(route('hazards.update', hazardId), { status: 'resolved' }, {
                preserveScroll: true,
                onSuccess: () => {
                    // If currently viewing "open" tab, remove it instantly from the table
                    if (tab === 'open') {
                        hazards.data = hazards.data.filter(h => h.id !== hazardId);
                    }
                },
            });
        }

        setModal({ open: false, action: null, hazardId: null });
    };

    const statusBadge = (status) => {
        const colors = {
            open: 'bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300',
            resolved: 'bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300',
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${colors[status] || 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
            >
                {status}
            </span>
        );
    };

    const severityBadge = (level) => {
        const levels = {
            1: 'bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300',
            2: 'bg-lime-100 text-lime-700 dark:bg-lime-800/40 dark:text-lime-300',
            3: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300',
            4: 'bg-orange-100 text-orange-700 dark:bg-orange-800/40 dark:text-orange-300',
            5: 'bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300',
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${levels[level] || 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
            >
                {level}
            </span>
        );
    };

    const ActionMenu = ({ hazard }) => {
        const [open, setOpen] = useState(false);
        const menuRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (e) => {
                if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
            };
            const handleEscape = (e) => e.key === 'Escape' && setOpen(false);

            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleEscape);
            };
        }, []);

        return (
            <div ref={menuRef} className="relative inline-block text-left">
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                    <span className="text-xl text-gray-700 dark:text-gray-200">⋮</span>
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 animate-fadeIn">
                        {hazard.status !== 'resolved' && (
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    confirmAction('resolve', hazard.id);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg transition"
                            >
                                Mark as Resolved
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setOpen(false);
                                confirmAction('delete', hazard.id);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-b-lg transition"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <AppLayout>
            <div className="p-6 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-5">Hazards</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {['open', 'resolved', 'all'].map((status) => {
                        const isActive = tab === status;
                        const isAll = status === 'all';
                        return (
                            <button
                                key={status}
                                onClick={() => handleTabChange(status)}
                                className={`px-4 py-2 rounded-lg border font-medium transition-all duration-200
                                    ${isActive
                                        ? isAll
                                            ? 'bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500 text-gray-900 dark:text-gray-100 shadow-sm'
                                            : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                                        : isAll
                                            ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                            : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        );
                    })}
                </div>

                {/* Table */}
                <div className="overflow-visible bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">Type</th>
                                <th className="px-4 py-3 text-left font-semibold">Description</th>
                                <th className="px-4 py-3 text-left font-semibold">Severity</th>
                                <th className="px-4 py-3 text-left font-semibold">Status</th>
                                <th className="px-4 py-3 text-left font-semibold">Reporter</th>
                                <th className="px-4 py-3 text-left font-semibold">Date</th>
                                <th className="px-4 py-3 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {hazards.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                        No hazards found.
                                    </td>
                                </tr>
                            ) : (
                                hazards.data.map((h, i) => (
                                    <tr
                                        key={h.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${i % 2 === 0 ? 'odd:bg-gray-50 dark:odd:bg-gray-800/40' : ''
                                            }`}
                                    >
                                        <td className="px-4 py-3">{h.hazard_type?.name || '—'}</td>
                                        <td className="px-4 py-3">{h.description || '—'}</td>
                                        <td className="px-4 py-3">{severityBadge(h.severity)}</td>
                                        <td className="px-4 py-3">{statusBadge(h.status)}</td>
                                        <td className="px-4 py-3">{h.user?.name || 'Unknown'}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                            {new Date(h.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <ActionMenu hazard={h} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400 gap-3">
                    <div>
                        Showing {hazards.from || 0}–{hazards.to || 0} of {hazards.total || 0}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {hazards.links.map((link, i) => (
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

                {/* Modal */}
                {modal.open && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn"
                        onClick={() => setModal({ open: false, action: null, hazardId: null })}
                    >
                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full text-center"
                            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                        >
                            <h2 className="text-lg font-semibold mb-3 capitalize">
                                {modal.action === 'delete' ? 'Delete Hazard' : 'Resolve Hazard'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                Are you sure you want to {modal.action} this hazard?
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setModal({ open: false, action: null, hazardId: null })}
                                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={performAction}
                                    className={`px-4 py-2 rounded-lg text-white font-medium shadow ${modal.action === 'delete'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
