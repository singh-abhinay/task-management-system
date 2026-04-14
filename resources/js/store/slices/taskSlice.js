import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null,
    filters: {
        status: "all",
        category: "all",
        search: "",
    },
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload;
            state.loading = false;
        },

        addTask: (state, action) => {
            state.tasks.unshift(action.payload);
        },

        updateTask: (state, action) => {
            const index = state.tasks.findIndex(
                (task) => task.id === action.payload.id,
            );
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },

        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(
                (task) => task.id !== action.payload,
            );
        },

        setSelectedTask: (state, action) => {
            state.selectedTask = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        clearFilters: (state) => {
            state.filters = initialState.filters;
        },

        realTimeUpdate: (state, action) => {
            const { type, task } = action.payload;
            if (type === "created") {
                state.tasks.unshift(task);
            } else if (type === "updated") {
                const index = state.tasks.findIndex((t) => t.id === task.id);
                if (index !== -1) state.tasks[index] = task;
            } else if (type === "deleted") {
                state.tasks = state.tasks.filter((t) => t.id !== task.id);
            }
        },
    },
});

export const {
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    setSelectedTask,
    setLoading,
    setError,
    setFilters,
    clearFilters,
    realTimeUpdate,
} = taskSlice.actions;

export default taskSlice.reducer;
