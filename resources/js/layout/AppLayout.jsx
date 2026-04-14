import Header from "../components/Header";
import Footer from "../components/Footer";
import ToastWrapper from "../components/ToastWrapper";

export default function AppLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ToastWrapper />
        </div>
    );
}
