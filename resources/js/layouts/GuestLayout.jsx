import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 pt-6 sm:justify-center sm:pt-0">
            <style>{`
                @keyframes colorFlow {
                    0%, 100% { 
                        background-position: 0% 0%;
                    }
                    50% { 
                        background-position: 0% 100%;
                    }
                }
                
                .animate-color-flow {
                    background: linear-gradient(
                        to bottom,
                        #ef4444 0%,
                        #eab308 33%,
                        #22c55e 66%,
                        #ef4444 100%
                    );
                    background-size: 100% 300%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: colorFlow 3s ease-in-out infinite;
                }
            `}</style>

            <div className="mb-8">
                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-red-500 blur-2xl opacity-40 rounded-full animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-red-500 to-red-700 p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                            <svg 
                                className="w-16 h-16 text-white animate-bounce" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                                />
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                                />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-white mb-2">
                            CMU<span className="animate-color-flow">Pin</span>
                        </h1>
                        <p className="text-blue-200 text-sm font-medium tracking-wide">
                            Crisis Management & Updates
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white/95 backdrop-blur-sm px-8 py-8 shadow-2xl sm:max-w-md sm:rounded-2xl border border-white/20">
                {children}
            </div>

            <div className="mt-8 text-center text-blue-200 text-sm">
                <p>2025</p>
            </div>
        </div>
    );
}