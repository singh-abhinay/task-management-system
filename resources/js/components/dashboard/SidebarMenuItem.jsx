import { Link } from "@inertiajs/react";

export default function SidebarMenuItem({
    icon,
    name,
    path,
    isOpen,
    isActive,
}) {
    return (
        <Link
            href={path}
            className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                    isActive
                        ? "bg-indigo-600 text-white"
                        : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
                }
                ${!isOpen && "justify-center"}
            `}
        >
            <span className="text-xl">{icon}</span>
            {isOpen && <span className="font-medium">{name}</span>}
        </Link>
    );
}
