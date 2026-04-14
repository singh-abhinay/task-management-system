import ToastWrapper from "../components/ToastWrapper";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
            <div className="w-full max-w-md px-4">{children}</div>
            <ToastWrapper />
        </div>
    );
}
