import DashboardLayout from "../layout/DashboardLayout";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function Tasks() {
    const { user, token } = useSelector((state) => state.auth);

    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isCompleted, setIsCompleted] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paginationData, setPaginationData] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
    });

    const fetchTasks = useCallback(
        async (page = 1, searchTerm = "", completed = null) => {
            setLoading(true);
            try {
                let url = `/api/tasks?page=${page}&per_page=10`;
                if (searchTerm) {
                    url += `&search=${encodeURIComponent(searchTerm)}`;
                }
                if (completed !== null && completed !== "") {
                    url += `&is_completed=${completed}`;
                }

                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Full API Response:", response.data);

                setTasks(response.data.data);
                setPaginationData({
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    per_page: response.data.per_page,
                    total: response.data.total,
                    from: response.data.from,
                    to: response.data.to,
                });

                console.log("Pagination Info:", {
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    total: response.data.total,
                    per_page: response.data.per_page,
                });
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        },
        [token],
    );

    useEffect(() => {
        fetchTasks(currentPage, search, isCompleted);
    }, [currentPage, fetchTasks]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                fetchTasks(1, search, isCompleted);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, isCompleted]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= paginationData.last_page) {
            setCurrentPage(newPage);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (value) => {
        setIsCompleted(value);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        fetchTasks(currentPage, search, isCompleted);
    };

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= paginationData.last_page; i++) {
            if (
                i === 1 ||
                i === paginationData.last_page ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push("...");
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                    <h1 className="text-2xl font-bold">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-indigo-100 mt-1">
                        You have {paginationData.total} task
                        {paginationData.total !== 1 ? "s" : ""} in total
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search tasks by title or description..."
                                    value={search}
                                    onChange={handleSearchChange}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <svg
                                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleFilterChange(null)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    isCompleted === null
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => handleFilterChange(0)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    isCompleted === 0
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => handleFilterChange(1)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    isCompleted === 1
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Completed
                            </button>
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Tasks
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                <p className="mt-2 text-gray-500">
                                    Loading tasks...
                                </p>
                            </div>
                        ) : tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-gray-900">
                                                    {task.title}
                                                </h3>
                                                {task.permission && (
                                                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                                                        {task.permission ===
                                                        "edit"
                                                            ? "Can Edit"
                                                            : "View Only"}
                                                    </span>
                                                )}
                                            </div>
                                            {task.description && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="flex gap-4 mt-2">
                                                <span className="text-xs text-gray-400">
                                                    Created:{" "}
                                                    {new Date(
                                                        task.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    task.is_completed
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {task.is_completed
                                                    ? "✓ Completed"
                                                    : "○ Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                <p className="mt-2 text-gray-500">
                                    No tasks found
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {search || isCompleted !== null
                                        ? "Try adjusting your search or filters"
                                        : "Create your first task to get started"}
                                </p>
                            </div>
                        )}
                    </div>

                    {paginationData.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage <= 1 || loading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    ← Previous
                                </button>

                                <div className="flex items-center gap-2">
                                    {/* Page Numbers */}
                                    <div className="hidden sm:flex gap-1">
                                        {getPageNumbers().map(
                                            (pageNum, index) =>
                                                pageNum === "..." ? (
                                                    <span
                                                        key={`dots-${index}`}
                                                        className="px-3 py-1 text-gray-500"
                                                    >
                                                        ...
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() =>
                                                            handlePageChange(
                                                                pageNum,
                                                            )
                                                        }
                                                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                            currentPage ===
                                                            pageNum
                                                                ? "bg-indigo-600 text-white"
                                                                : "text-gray-700 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                ),
                                        )}
                                    </div>

                                    <span className="text-sm text-gray-600 sm:hidden">
                                        Page {paginationData.current_page} of{" "}
                                        {paginationData.last_page}
                                    </span>
                                </div>

                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={
                                        currentPage >=
                                            paginationData.last_page || loading
                                    }
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next →
                                </button>
                            </div>

                            {/* Page info */}
                            <div className="mt-3 text-center text-sm text-gray-500">
                                Page {paginationData.current_page} of{" "}
                                {paginationData.last_page}
                            </div>
                        </div>
                    )}

                    {!loading && paginationData.total > 0 && (
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                            <div className="text-sm text-gray-600 text-center">
                                Showing{" "}
                                {paginationData.from ||
                                    (paginationData.current_page - 1) *
                                        paginationData.per_page +
                                        1}{" "}
                                to{" "}
                                {paginationData.to ||
                                    Math.min(
                                        paginationData.current_page *
                                            paginationData.per_page,
                                        paginationData.total,
                                    )}{" "}
                                of {paginationData.total} tasks
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
