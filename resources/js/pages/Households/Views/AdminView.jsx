import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import HouseholdFormModal from '@/components/HouseholdFormModal';
import AppLayout from '@/layouts/AppLayout';

export default function AdminView({ households, filters, users, requests }) {
    const [primaryTab, setPrimaryTab] = useState(filters.primary || 'households');
    const [subTab, setSubTab] = useState(filters.status || 'safe');

    const [modal, setModal] = useState({ open: false, action: null, household: null });
    const [formModal, setFormModal] = useState({ open: false, mode: 'create', household: null });
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        lat: '',
        long: '',
        status: 'safe',
    });
    const [statusModal, setStatusModal] = useState({ open: false, household: null, status: 'safe' });

    const openStatusModal = (household) => {
        setStatusModal({ open: true, household, status: household.status });
    };

    const closeStatusModal = () => {
        setStatusModal({ open: false, household: null, status: 'safe' });
    };

    const handlePrimaryTabChange = (tab) => {
        setPrimaryTab(tab);
        if (tab !== 'requests') {
            setSubTab('safe');
        }
    };

    const handleSubTabChange = (status) => {
        setSubTab(status);
        router.get(route('households.index'), { status }, { preserveState: true, replace: true });
    };

    const confirmAction = (action, household) => {
        setModal({ open: true, action, household });
    };

    const performAction = () => {
        const { action, household } = modal;

        if (action === 'delete') {
            router.delete(route('households.destroy', household.id), {
                preserveScroll: true,
                onSuccess: () => {
                    households.data = households.data.filter(h => h.id !== household.id);
                },
            });
        } else if (action === 'change-status') {
            const statuses = ['safe', 'at_risk', 'need_rescue', 'evacuated'];
            const currentIndex = statuses.indexOf(household.status);
            const newStatus = statuses[(currentIndex + 1) % statuses.length];

            router.patch(route('households.update', household.id), { status: newStatus }, {
                preserveScroll: true,
                onSuccess: () => {
                    if (subTab !== 'all') {
                        households.data = households.data.filter(h => h.id !== household.id);
                    }
                },
            });
        }

        setModal({ open: false, action: null, household: null });
    };

    const openFormModal = (mode, household = null) => {
        setFormModal({ open: true, mode, household });
        if (household) {
            setFormData({
                name: household.name,
                address: household.address,
                lat: household.lat,
                long: household.long,
                status: household.status,
                user_id: household.user_id || '',
            });
        } else {
            setFormData({
                name: '',
                address: '',
                lat: '',
                long: '',
                status: 'safe',
                user_id: '',
            });
        }
    };

    const closeFormModal = () => {
        setFormModal({ open: false, mode: 'create', household: null });
        setFormData({
            name: '',
            address: '',
            lat: '',
            long: '',
            status: 'safe',
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (formModal.mode === 'create') {
            router.post(route('households.store'), formData, {
                preserveScroll: true,
                onSuccess: () => closeFormModal(),
            });
        } else {
            router.patch(route('households.update', formModal.household.id), formData, {
                preserveScroll: true,
                onSuccess: () => closeFormModal(),
            });
        }
    };

    const statusBadge = (status) => {
        const colors = {
            safe: 'bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300',
            at_risk: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300',
            need_rescue: 'bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300',
            evacuated: 'bg-gray-100 text-gray-700 dark:bg-gray-700/60 dark:text-gray-300',
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${colors[status] || 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
            >
                {status.replace('_', ' ')}
            </span>
        );
    };

    const ActionMenu = ({ household }) => {
        const [open, setOpen] = useState(false);
        const menuRef = useRef(null);
        const [status, setStatus] = useState(household.status);

        const statuses = ['safe', 'at_risk', 'need_rescue', 'evacuated'];

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

        const handleStatusChange = (newStatus) => {
            setStatus(newStatus);
            router.patch(route('households.update', household.id), { status: newStatus }, {
                preserveScroll: true,
                onSuccess: () => {
                    household.status = newStatus;
                },
            });
        };

        return (
            <div ref={menuRef} className="relative inline-block text-left">
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                    <span className="text-xl text-gray-700 dark:text-gray-200">⋮</span>
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 animate-fadeIn p-2">
                        <button
                            onClick={() => { setOpen(false); openFormModal('edit', household); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg transition"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => { setOpen(false); openStatusModal(household); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                            Change Status
                        </button>

                        <button
                            onClick={() => { setOpen(false); confirmAction('delete', household); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-b-lg transition mt-1"
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
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Households</h1>
                    </div>
                    {primaryTab === 'households' && (
                        <button
                            onClick={() => openFormModal('create')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow font-medium transition"
                        >
                            + Add Household
                        </button>
                    )}
                </div>

                {/* Primary Tabs */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {['households', 'requests'].map((t) => (
                        <button
                            key={t}
                            onClick={() => handlePrimaryTabChange(t)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                            ${primaryTab === t
                                    ? 'bg-gray-200 dark:bg-gray-700 shadow-sm'
                                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Sub Tabs only for households */}
                {primaryTab === 'households' && (
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {['safe', 'at_risk', 'need_rescue', 'evacuated', 'all'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleSubTabChange(status)}
                                className={`px-4 py-2 rounded-lg border font-medium transition-all duration-200
                                ${subTab === status
                                        ? 'bg-gray-200 dark:bg-gray-700 shadow-sm'
                                        : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                            </button>
                        ))}
                    </div>
                )}

                {/* Table Rendering */}
                {primaryTab === 'requests' ? (
                    <div className="overflow-visible bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 mt-4">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">User</th>
                                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                                    <th className="px-4 py-3 text-left font-semibold">Household</th>
                                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {requests.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                            No requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.data.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-4 py-3">{r.user.name}</td>
                                            <td className="px-4 py-3 capitalize">{r.type}</td>
                                            <td className="px-4 py-3">{r.household?.name || '-'}</td>
                                            <td className="px-4 py-3 capitalize">{r.status}</td>
                                            <td className="px-4 py-3 text-right flex gap-2 justify-end">
                                                <button
                                                    onClick={() => router.patch(route('households.requests.approve', r.id), {}, { preserveScroll: true })}
                                                    className="px-3 py-1 rounded bg-green-600 text-white text-xs"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => router.patch(route('households.requests.deny', r.id), {}, { preserveScroll: true })}
                                                    className="px-3 py-1 rounded bg-red-600 text-white text-xs"
                                                >
                                                    Deny
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-visible bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold">Address</th>
                                    <th className="px-4 py-3 text-left font-semibold">Latitude</th>
                                    <th className="px-4 py-3 text-left font-semibold">Longitude</th>
                                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold">Created</th>
                                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {households.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                            No households found.
                                        </td>
                                    </tr>
                                ) : (
                                    households.data
                                        .filter(h => subTab === 'all' || h.status === subTab)
                                        .map((h, i) => (
                                            <tr key={h.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${i % 2 === 0 ? 'odd:bg-gray-50 dark:odd:bg-gray-800/40' : ''}`}>
                                                <td className="px-4 py-3 font-medium">{h.name}</td>
                                                <td className="px-4 py-3">{h.address}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{h.lat}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{h.long}</td>
                                                <td className="px-4 py-3">{statusBadge(h.status)}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                    {new Date(h.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <ActionMenu household={h} />
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400 gap-3">
                    <div>
                        Showing {households.from || 0}–{households.to || 0} of {households.total || 0}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {households.links.map((link, i) => (
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

                {/* Confirmation Modal */}
                {modal.open && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn"
                        onClick={() => setModal({ open: false, action: null, household: null })}
                    >
                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-lg font-semibold mb-3 capitalize">
                                {modal.action === 'delete' ? 'Delete Household' : 'Change Status'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                {modal.action === 'delete'
                                    ? 'Are you sure you want to delete this household?'
                                    : `Cycle status for this household?`}
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setModal({ open: false, action: null, household: null })}
                                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={performAction}
                                    className={`px-4 py-2 rounded-lg text-white font-medium shadow ${modal.action === 'delete'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status change modal */}
                {statusModal.open && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn"
                        onClick={closeStatusModal}
                    >
                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-lg font-semibold mb-3">Change Household Status</h2>
                            <div className="flex flex-col gap-3">
                                {['safe', 'at_risk', 'need_rescue', 'evacuated'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            router.patch(route('households.update', statusModal.household.id), { status: s }, { preserveScroll: true });
                                            closeStatusModal();
                                        }}
                                        className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 transition capitalize"
                                    >
                                        {s.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={closeStatusModal}
                                className="mt-4 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Household Form Modal */}
                {formModal.open && (
                    <HouseholdFormModal
                        show={formModal.open}
                        mode={formModal.mode}
                        users={users}
                        formData={formData}
                        onClose={closeFormModal}
                        onSubmit={handleFormSubmit}
                        household={formModal.household}
                    />
                )}
            </div>
        </AppLayout>

    );
}
