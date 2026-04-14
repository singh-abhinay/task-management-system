import GuestLayout from "../layout/GuestLayout";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../store/slices/uiSlice";
import { setUser, setLoading } from "../store/slices/authSlice";
import api from "../api/axios";
import { router } from "@inertiajs/react";

export default function Login() {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState({
        email: "",
        password: "",
        general: "",
    });

    const handleFormData = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (error[name]) {
            setError((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateFormData = () => {
        let isValid = true;
        const newErrors = { email: "", password: "", general: "" };

        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setError(newErrors);
        return isValid;
    };

    const loginFormSubmit = async (e) => {
        e.preventDefault();

        setError({
            email: "",
            password: "",
            general: "",
        });

        if (!validateFormData()) return;

        dispatch(setLoading(true));

        try {
            await api.get("/sanctum/csrf-cookie");
            const response = await api.post("/login", {
                email: formData.email,
                password: formData.password,
            });

            dispatch(
                setUser({
                    user: response.data.user,
                }),
            );

            dispatch(
                showToast({
                    message: response.data.message || "Login successful!",
                    type: "success",
                }),
            );

            router.visit("/dashboard");
        } catch (err) {
            const response = err.response;

            if (response?.data?.errors) {
                const errors = response.data.errors;
                setError({
                    email: errors.email ? errors.email[0] : "",
                    password: errors.password ? errors.password[0] : "",
                    general: "",
                });
            } else {
                setError({
                    email: "",
                    password: "",
                    general:
                        response?.data?.message ||
                        "Something went wrong. Please try again.",
                });
            }

            dispatch(
                showToast({
                    message: response?.data?.message || "Login failed",
                    type: "error",
                }),
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <GuestLayout>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Sign in to your account
                    </p>
                </div>

                {error.general && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
                        {error.general}
                    </div>
                )}

                <form className="space-y-5" onSubmit={loginFormSubmit}>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormData}
                            className={`w-full px-4 py-3 border rounded-xl ${
                                error.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {error.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {error.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleFormData}
                            className={`w-full px-4 py-3 border rounded-xl ${
                                error.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {error.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {error.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}
