import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
    try {
        const serializedUser = localStorage.getItem("user");

        if (serializedUser) {
            return {
                user: JSON.parse(serializedUser),
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        }
    } catch (error) {
        console.log("Error loading from localStorage:", error);
    }

    return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    };
};

const initialState = loadFromLocalStorage();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setUser: (state, action) => {
            console.log("setUser action payload:", action.payload);

            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            if (action.payload.user) {
                try {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(action.payload.user),
                    );
                    console.log("User saved to localStorage");
                } catch (error) {
                    console.log("Error saving to localStorage:", error);
                }
            }
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            try {
                localStorage.removeItem("user");
                console.log("localStorage cleared on logout");
            } catch (error) {
                console.log("Error clearing localStorage:", error);
            }
        },

        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setLoading, setUser, logout, setError, clearError } =
    authSlice.actions;
export default authSlice.reducer;
