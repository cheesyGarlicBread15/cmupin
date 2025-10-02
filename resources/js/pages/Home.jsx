import AppLayout from '../layouts/AppLayout';

export default function Home() {
    return (
        <AppLayout>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-gray-800 p-6 rounded-lg shadow">Card 1</div>
                <div className="bg-gray-800 p-6 rounded-lg shadow">Card 2</div>
                <div className="bg-gray-800 p-6 rounded-lg shadow">Card 3</div>
            </div>
        </AppLayout>
    );
}
