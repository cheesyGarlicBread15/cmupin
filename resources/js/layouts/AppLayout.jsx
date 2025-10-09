import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage(); // to check active route
    const { post } = useForm();

    const navLinks = [
        { name: "Home", href: route('home') },
        { name: "Map", href: route('map') },
        { name: "Profile", href: route('profile.edit') },
    ];

    const handleLogout = () => {
        post(route('logout'));
    };

    return (
        <div className="flex h-screen bg-gray-950 text-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-30
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} 
                    md:translate-x-0 md:static md:inset-0`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-5 text-2xl font-extrabold tracking-wide text-center border-b border-gray-800">
                        CMU<span className="text-red-500">Pin</span>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {navLinks.map((link) => {
                            const isActive = url.startsWith(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200
                                        ${isActive
                                            ? "bg-red-600 text-white font-medium"
                                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="mr-3">{link.icon}</span>
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-md text-white font-semibold transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile topbar */}
                <div className="md:hidden bg-gray-900 border-b border-gray-800 p-3 flex items-center justify-between">
                    <div className="text-xl font-bold text-red-500">CMUPin</div>
                    <button
                        className="text-gray-200 text-2xl focus:outline-none"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ☰
                    </button>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
