import AppLayout from "../layout/AppLayout";

export default function Homepage() {
    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
                <section className="container mx-auto px-4 py-20 lg:py-28">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Manage Tasks with{" "}
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl inline-block">
                                Real-time
                            </span>{" "}
                            Updates
                        </h1>
                        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                            Collaborate seamlessly, track progress instantly,
                            and never miss a deadline with live task
                            synchronization across all your devices.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="/register"
                                className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:shadow-xl transition text-lg"
                            >
                                Get Started Free
                            </a>
                            <a
                                href="#"
                                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition text-lg"
                            >
                                Watch Demo
                            </a>
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white hover:bg-white/20 transition">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                                Lightning Fast
                            </h3>
                            <p className="text-white/80">
                                Real-time updates mean your tasks sync instantly
                                across all team members.
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white hover:bg-white/20 transition">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                                Team Collaboration
                            </h3>
                            <p className="text-white/80">
                                Assign tasks, leave comments, and track progress
                                together in real-time.
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white hover:bg-white/20 transition">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                                Secure & Reliable
                            </h3>
                            <p className="text-white/80">
                                Enterprise-grade security keeps your data safe
                                and always available.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
