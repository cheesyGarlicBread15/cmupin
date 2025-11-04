import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import AdminView from './Views/AdminView';
import LeaderView from './Views/LeaderView';
import MemberView from './Views/MemberView';

export default function Households({ households, filters, users }) {
    const { user, isAdmin, isLeader, isMember } = useAuth();

    console.log(isAdmin);

    return (
        <AppLayout>
            {isAdmin() && <AdminView households={households} filters={filters} users={users} />}
            {isLeader() && <LeaderView />}
            {isMember() && <MemberView />}
        </AppLayout>
    );
}
