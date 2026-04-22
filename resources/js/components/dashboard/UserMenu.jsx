import { useState } from "react";
import { router } from "@inertiajs/react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { showToast } from "../../store/slices/uiSlice";
import { Link } from "@inertiajs/react";
import api from "../../api/axios";

export default function UserMenu({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await api.post("/logout");
            localStorage.removeItem("user");
            dispatch(logout());
            dispatch(
                showToast({
                    message: "Logged out successfully",
                    type: "success",
                }),
            );
            router.visit("/login");
        } catch (error) {
            console.error("Logout error:", error);
            localStorage.removeItem("user");
            dispatch(logout());
            router.visit("/login");
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none"
            >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                </div>
                <span className="text-gray-700 hidden md:block">
                    {user?.name}
                </span>
                <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border">
                        <Link
                            href="/profile"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Profile Settings
                        </Link>
                        <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <hr className="my-1" />
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
