import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [currentPath, setCurrentPath] = useState("");

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                currentPath={currentPath}
            />

            <div className="lg:pl-20 transition-all duration-300">
                <Header user={user} onMobileMenuOpen={toggleSidebar} />

                <main className="pt-16 p-6">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
