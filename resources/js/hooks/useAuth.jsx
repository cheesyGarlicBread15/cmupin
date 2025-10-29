import { usePage } from '@inertiajs/react';

export function useAuth() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const roles = Array.isArray(user?.role) ? user.role : [];

    const hasRole = (role) => roles.includes(role);

    const hasAnyRole = (roleList) => roleList.some((r) => roles.includes(r));
    const hasAllRoles = (roleList) => roleList.every((r) => roles.includes(r));

    const isAdmin = () => hasRole('admin');
    const isLeader = () => hasRole('leader');
    const isMember = () => hasRole('member');

    return {
        user,
        roles,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        isAdmin,
        isLeader,
        isMember,
    };
}
