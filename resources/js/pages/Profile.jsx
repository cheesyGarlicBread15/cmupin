import AppLayout from '../layouts/AppLayout';

export default function Profile() {
    const dummyProfile = {
        name: "John Doe",
        email: "john@example.com",
        created_at: "2025-01-01",
    };

    return (
        <AppLayout>
            <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4">Profile</h1>
                <div className="space-y-3">
                    <div><span className="text-gray-400">Name:</span> {dummyProfile.name}</div>
                    <div><span className="text-gray-400">Email:</span> {dummyProfile.email}</div>
                    <div><span className="text-gray-400">Joined:</span> {dummyProfile.created_at}</div>
                </div>
            </div>
        </AppLayout>
    );
}
