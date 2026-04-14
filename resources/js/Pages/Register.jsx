import GuestLayout from "../layout/GuestLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../store/slices/uiSlice";
import {
    setUser,
    setLoading,
    setError,
    clearError,
} from "../store/slices/authSlice";
import api from "../api/axios";

export default function Register() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleFormData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
        dispatch(clearError());
    };

    const handleCustomerRegistration = async (e) => {
        e.preventDefault();

        if (!validateFormData()) return;

        dispatch(setLoading(true));

        try {
            const response = await api.post("/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });

            dispatch(
                setUser({
                    user: response.data.user,
                    token: response.data.token,
                }),
            );

            localStorage.setItem("token", response.data.token);

            dispatch(
                showToast({
                    message:
                        response.data.message || "Registration successful!",
                    type: "success",
                }),
            );

            setTimeout(() => {
                router.visit("/dashboard");
            }, 1000);
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const validationErrors = err.response.data.errors;
                const newFieldErrors = {
                    name: "",
                    email: "",
                    password: "",
                    password_confirmation: "",
                };

                if (validationErrors.name) {
                    newFieldErrors.name = validationErrors.name[0];
                }
                if (validationErrors.email) {
                    newFieldErrors.email = validationErrors.email[0];
                }
                if (validationErrors.password) {
                    newFieldErrors.password = validationErrors.password[0];
                }
                if (validationErrors.password_confirmation) {
                    newFieldErrors.password_confirmation =
                        validationErrors.password_confirmation[0];
                }

                setFieldErrors(newFieldErrors);
                dispatch(setError(err.response.data.message));

                dispatch(
                    showToast({
                        message:
                            err.response.data.message || "Validation failed",
                        type: "error",
                    }),
                );
            } else {
                const errorMessage =
                    err.response?.data?.message || "Registration failed";
                dispatch(setError(errorMessage));

                dispatch(
                    showToast({
                        message: errorMessage,
                        type: "error",
                    }),
                );
            }
        } finally {
            dispatch(setLoading(false));
        }
    };

    function validateFormData() {
        let valid = true;
        const newFieldErrors = {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        };

        if (!formData.name.trim()) {
            newFieldErrors.name = "Name is required";
            valid = false;
        }

        if (!formData.email.trim()) {
            newFieldErrors.email = "Email is required";
            valid = false;
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
        ) {
            newFieldErrors.email = "Invalid email address";
            valid = false;
        }

        if (!formData.password) {
            newFieldErrors.password = "Password is required";
            valid = false;
        } else if (formData.password.length < 6) {
            newFieldErrors.password = "Password must be at least 6 characters";
            valid = false;
        }

        if (formData.password !== formData.password_confirmation) {
            newFieldErrors.password_confirmation = "Passwords do not match";
            valid = false;
        }

        setFieldErrors(newFieldErrors);
        return valid;
    }

    return (
        <GuestLayout>
            <div className="bg-white p-8 rounded-2xl shadow-xl my-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        Create Account
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Join TaskFlow and start managing tasks in real-time
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form
                    className="space-y-5"
                    onSubmit={handleCustomerRegistration}
                >
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                                fieldErrors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            value={formData.name}
                            onChange={handleFormData}
                        />
                        {fieldErrors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {fieldErrors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                                fieldErrors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            value={formData.email}
                            onChange={handleFormData}
                        />
                        {fieldErrors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {fieldErrors.email}
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
                            placeholder="Create a strong password"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                                fieldErrors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            value={formData.password}
                            onChange={handleFormData}
                        />
                        {fieldErrors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            placeholder="Confirm your password"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                                fieldErrors.password_confirmation
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            value={formData.password_confirmation}
                            onChange={handleFormData}
                        />
                        {fieldErrors.password_confirmation && (
                            <p className="text-red-500 text-sm mt-1">
                                {fieldErrors.password_confirmation}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="terms" className="ml-2 text-gray-600">
                            I agree to the{" "}
                            <Link
                                href="/terms"
                                className="text-indigo-600 hover:text-indigo-700"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy"
                                className="text-indigo-600 hover:text-indigo-700"
                            >
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-indigo-600 font-semibold hover:text-indigo-700"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
