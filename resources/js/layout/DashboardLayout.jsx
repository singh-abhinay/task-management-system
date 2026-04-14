import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import ToastWrapper from "../components/ToastWrapper";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const currentPath = window.location.pathname;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                currentPath={currentPath}
            />

            {/* Mobile sidebar overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <div
                className={`
                fixed inset-0 z-40 lg:hidden transition-transform duration-300
                ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
            >
                <Sidebar
                    isOpen={true}
                    onToggle={() => {}}
                    currentPath={currentPath}
                />
            </div>

            {/* Main Content Area */}
            <div
                className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
            >
                <Header
                    user={user}
                    onMobileMenuOpen={() => setMobileMenuOpen(true)}
                />

                <main className="pt-16 p-6">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>

            <ToastWrapper />
        </div>
    );
}
