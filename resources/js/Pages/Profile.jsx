import DashboardLayout from "../layout/DashboardLayout";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { setUser } from "../store/slices/authSlice";
import { showToast } from "../store/slices/uiSlice";
import api from "../api/axios";

export default function Profile() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });
    const [errors, setErrors] = useState({});

    // Initialize form with user data when editing starts
    useEffect(() => {
        if (user && isEditing) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                current_password: "",
                new_password: "",
                new_password_confirmation: "",
            });
            setErrors({});
        }
    }, [user, isEditing]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    // Frontend validation function
    const validatePasswordFields = () => {
        const newErrors = {};

        // Check if user is trying to change password
        const isChangingPassword =
            formData.current_password !== "" ||
            formData.new_password !== "" ||
            formData.new_password_confirmation !== "";

        if (isChangingPassword) {
            // If any password field is filled, validate all
            if (!formData.current_password) {
                newErrors.current_password = [
                    "Current password is required to change password",
                ];
            }

            if (!formData.new_password) {
                newErrors.new_password = ["New password is required"];
            } else if (formData.new_password.length < 6) {
                newErrors.new_password = [
                    "New password must be at least 6 characters",
                ];
            }

            if (formData.new_password !== formData.new_password_confirmation) {
                newErrors.new_password_confirmation = [
                    "Password confirmation does not match",
                ];
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare data - ONLY send fields that have changed
        const data = {};

        // Check if name changed
        if (formData.name !== user.name) {
            data.name = formData.name;
        }

        // Check if email changed
        if (formData.email !== user.email) {
            data.email = formData.email;
        }

        // Check if user wants to change password
        const isChangingPassword =
            formData.current_password !== "" ||
            formData.new_password !== "" ||
            formData.new_password_confirmation !== "";

        if (isChangingPassword) {
            // Run frontend validation
            if (!validatePasswordFields()) {
                setLoading(false);
                return;
            }

            data.current_password = formData.current_password;
            data.new_password = formData.new_password;
            data.new_password_confirmation = formData.new_password_confirmation;
        }

        // If no changes, show message and return
        if (Object.keys(data).length === 0) {
            dispatch(
                showToast({
                    message: "No changes to update",
                    type: "info",
                }),
            );
            setLoading(false);
            return;
        }

        try {
            const response = await api.put("/profile", data);

            if (response.data.success) {
                dispatch(setUser({ user: response.data.user }));
                dispatch(
                    showToast({
                        message:
                            response.data.message ||
                            "Profile updated successfully!",
                        type: "success",
                    }),
                );

                // Reset form
                setFormData({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    current_password: "",
                    new_password: "",
                    new_password_confirmation: "",
                });
                setErrors({});
                setIsEditing(false);
            } else {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                }
                dispatch(
                    showToast({
                        message: response.data.message || "Update failed",
                        type: "error",
                    }),
                );
            }
        } catch (error) {
            console.error("Update error:", error);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                // Show first error in toast
                const firstError = Object.values(
                    error.response.data.errors,
                )[0]?.[0];
                if (firstError) {
                    dispatch(showToast({ message: firstError, type: "error" }));
                }
            } else if (error.response?.data?.message) {
                dispatch(
                    showToast({
                        message: error.response.data.message,
                        type: "error",
                    }),
                );
            } else {
                dispatch(
                    showToast({
                        message: "Something went wrong. Please try again.",
                        type: "error",
                    }),
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setErrors({});
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            current_password: "",
            new_password: "",
            new_password_confirmation: "",
        });
    };

    if (!user) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <p className="text-indigo-100 mt-2">
                        Manage your account information
                    </p>
                </div>

                {/* Profile Content */}
                <div className="bg-white rounded-xl shadow-sm">
                    {!isEditing ? (
                        <div>
                            <div className="p-6 border-b flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Profile Information
                                </h2>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Profile Image Placeholder */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {user.name}
                                        </h3>
                                        <p className="text-gray-500">
                                            Member since{" "}
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                                            {user.name}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                                            {user.email}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Account Status
                                        </label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                Active
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Verification
                                        </label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg">
                                            {user.email_verified_at ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                                    Not Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Account Stats */}
                                <div className="border-t pt-6">
                                    <h3 className="text-md font-semibold text-gray-800 mb-4">
                                        Account Statistics
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <p className="text-sm text-blue-600">
                                                User ID
                                            </p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                #{user.id}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-4">
                                            <p className="text-sm text-purple-600">
                                                Joined Date
                                            </p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <p className="text-sm text-green-600">
                                                Last Updated
                                            </p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {new Date(
                                                    user.updated_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile}>
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Edit Profile
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Update your personal information
                                </p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
                                        Basic Information
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.name
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.name[0]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.email
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.email[0]}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Change Password Section */}
                                <div className="space-y-4">
                                    <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
                                        Change Password
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Leave password fields empty if you don't
                                        want to change it
                                    </p>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="current_password"
                                            value={formData.current_password}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.current_password
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                        {errors.current_password && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.current_password[0]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="new_password"
                                            value={formData.new_password}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.new_password
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                        {errors.new_password && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.new_password[0]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="new_password_confirmation"
                                            value={
                                                formData.new_password_confirmation
                                            }
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.new_password_confirmation
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                        {errors.new_password_confirmation && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {
                                                    errors
                                                        .new_password_confirmation[0]
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
