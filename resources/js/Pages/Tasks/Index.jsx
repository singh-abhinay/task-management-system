import DashboardLayout from "../../layout/DashboardLayout";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Tasks() {
    const { user, token } = useSelector((state) => state.auth);

    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    // Fetch Tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/tasks", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Add Task (title + description)
    const addTask = async () => {
        if (!form.title.trim()) return;

        try {
            await axios.post(
                "/api/tasks",
                {
                    title: form.title,
                    description: form.description,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            setForm({ title: "", description: "" });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    // Update Completion
    const toggleComplete = async (task) => {
        try {
            await axios.put(
                `/api/tasks/${task.id}`,
                { is_completed: !task.is_completed },
                { headers: { Authorization: `Bearer ${token}` } },
            );
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const getStats = () => {
        return {
            total: tasks.length,
            completed: tasks.filter((t) => t.is_completed).length,
            pending: tasks.filter((t) => !t.is_completed).length,
        };
    };

    const stats = getStats();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Welcome */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                    <h1 className="text-2xl font-bold">
                        Welcome back, {user?.name}!
                    </h1>
                </div>

                {/* Add Task Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                    <input
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                        placeholder="Task title"
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        placeholder="Task description (optional)"
                        className="w-full border px-3 py-2 rounded-lg"
                    />

                    <button
                        onClick={addTask}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                    >
                        Create Task
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <StatCard label="Total" value={stats.total} />
                    <StatCard label="Completed" value={stats.completed} />
                    <StatCard label="Pending" value={stats.pending} />
                </div>

                {/* Task List */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {task.title}
                                        </p>
                                        {task.description && (
                                            <p className="text-sm text-gray-500">
                                                {task.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                            Permission: {task.permission}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => toggleComplete(task)}
                                        className={`px-3 py-1 rounded text-sm ${
                                            task.is_completed
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {task.is_completed
                                            ? "Completed"
                                            : "Mark Complete"}
                                    </button>
                                </div>
                            ))}

                            {tasks.length === 0 && (
                                <p className="text-center text-gray-500">
                                    No tasks found
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}
