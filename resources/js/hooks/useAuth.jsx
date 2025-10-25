import { usePage } from '@inertiajs/react';

export function useAuth() {
    const { auth } = usePage().props;

    const hasRole = (role) => {
        return auth.user?.role.includes(role) ?? false;
    };

    const hasAnyRole = (roles) => {
        return roles.some(role => hasRole(role));
    };

    const hasAllRoles = (roles) => {
        return roles.every(role => hasRole(role));
    };

    const isAdmin = () => hasRole('admin');
    const isLeader = () => hasRole('leader');
    const isMember = () => hasRole('member');

    return {
        user: auth.user,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        isAdmin,
        isLeader,
        isMember,
    };
}