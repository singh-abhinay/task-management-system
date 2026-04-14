import React from "react";

export default function Header() {
    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-800">
                            TaskFlow
                        </span>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <a
                            href="#"
                            className="text-gray-700 hover:text-indigo-600 transition font-medium"
                        >
                            Features
                        </a>
                        <a
                            href="#"
                            className="text-gray-700 hover:text-indigo-600 transition font-medium"
                        >
                            Pricing
                        </a>
                        <a
                            href="#"
                            className="text-gray-700 hover:text-indigo-600 transition font-medium"
                        >
                            About
                        </a>
                        <a
                            href="#"
                            className="text-gray-700 hover:text-indigo-600 transition font-medium"
                        >
                            Contact
                        </a>
                    </div>
                    <div className="flex space-x-3">
                        <a
                            href="/login"
                            className="px-5 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition"
                        >
                            Login
                        </a>
                        <a
                            href="/register"
                            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
                        >
                            Sign Up
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
