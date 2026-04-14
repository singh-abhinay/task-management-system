export default function MobileMenuButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
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
                    d="M4 6h16M4 12h16M4 18h16"
                />
            </svg>
        </button>
    );
}
