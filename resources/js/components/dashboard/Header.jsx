import UserMenu from "./UserMenu";
import MobileMenuButton from "./MobileMenuButton";

export default function Header({ user, onMobileMenuOpen }) {
    return (
        <header className="bg-white shadow-sm fixed top-0 right-0 left-0 lg:left-64 z-30 transition-all duration-300">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-4">
                    <MobileMenuButton onClick={onMobileMenuOpen} />
                    <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
                        Welcome back, {user?.name?.split(" ")[0]}!
                    </h1>
                </div>
                <UserMenu user={user} />
            </div>
        </header>
    );
}
