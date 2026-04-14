import SidebarMenuItem from "./SidebarMenuItem";

export default function Sidebar({ isOpen, onToggle, currentPath }) {
    const menuItems = [
        { path: "/dashboard", name: "Dashboard", icon: "📊" },
        { path: "/tasks", name: "All Tasks", icon: "📋" },
        { path: "/tasks/create", name: "Create Task", icon: "➕" },
        { path: "/categories", name: "Categories", icon: "🏷️" },
        { path: "/shared-with-me", name: "Shared With Me", icon: "👥" },
        { path: "/analytics", name: "Analytics", icon: "📈" },
        { path: "/profile", name: "Profile", icon: "👤" },
    ];

    return (
        <aside
            className={`
            fixed top-0 left-0 z-40 h-screen transition-all duration-300 
            bg-gradient-to-b from-indigo-800 to-purple-800 text-white
            ${isOpen ? "w-64" : "w-20"}
        `}
        >
            {/* Logo Section */}
            <div className="flex items-center justify-between p-4 border-b border-indigo-700 h-16">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-xl">
                            T
                        </span>
                    </div>
                    {isOpen && (
                        <span className="text-xl font-bold">TaskFlow</span>
                    )}
                </div>
                <button
                    onClick={onToggle}
                    className="hidden lg:block p-1 hover:bg-indigo-700 rounded transition"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                                isOpen
                                    ? "M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                    : "M13 5l7 7-7 7M5 5l7 7-7 7"
                            }
                        />
                    </svg>
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                    <SidebarMenuItem
                        key={item.path}
                        icon={item.icon}
                        name={item.name}
                        path={item.path}
                        isOpen={isOpen}
                        isActive={currentPath === item.path}
                    />
                ))}
            </nav>
        </aside>
    );
}
