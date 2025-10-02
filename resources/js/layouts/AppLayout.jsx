import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Map", href: "/map" },
        { name: "Profile", href: "/profile" },
    ];

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-gray-800 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 md:static md:inset-0`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 text-xl font-bold">CMUPin</div>
                    <nav className="flex-1 px-2 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-4 py-2 rounded-md hover:bg-gray-700 transition"
                                onClick={() => setSidebarOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4">
                        <button className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-md">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile topbar */}
                <div className="md:hidden bg-gray-800 p-2 flex items-center">
                    <button
                        className="text-gray-100"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ☰
                    </button>
                    <div className="ml-4 text-lg font-bold">CMUPin</div>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
