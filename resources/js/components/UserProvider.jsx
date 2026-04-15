import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "../store/slices/authSlice";
import api from "../api/axios";

export default function UserProvider({ children }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const checkAuthStatus = async () => {
            // Skip checking on login/register pages
            const publicRoutes = ["/login", "/register", "/"];
            const currentPath = window.location.pathname;

            if (publicRoutes.includes(currentPath)) {
                console.log("On public route, skipping auth check");
                return;
            }

            if (user) {
                console.log("User already in Redux:", user);
                return;
            }

            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                console.log("Found user in localStorage, restoring to Redux");
                dispatch(setUser({ user: JSON.parse(storedUser) }));
                return;
            }

            try {
                dispatch(setLoading(true));
                console.log("Checking authentication status with backend...");

                await api.get("/sanctum/csrf-cookie");
                console.log("=====api hitting");
                const response = await api.get("/me");

                if (response.data) {
                    console.log(
                        "User authenticated from session:",
                        response.data,
                    );
                    dispatch(setUser({ user: response.data }));
                }
            } catch (error) {
                console.log(
                    "No authenticated user found:",
                    error.response?.status,
                );
                localStorage.removeItem("user");
            } finally {
                dispatch(setLoading(false));
            }
        };

        checkAuthStatus();
    }, [dispatch, user]);

    return children;
}
