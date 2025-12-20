"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 1. State for Form Data
    const [data, setData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    // 2. State for Token (from URL)
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);

    // 3. Extract Token on Load
    useEffect(() => {
        const urlToken = searchParams.get("resettoken"); // Make sure your email link uses ?resettoken=...
        if (urlToken) {
            setToken(urlToken);
        } else {
            toast.error("Invalid or missing token");
        }
    }, [searchParams]);

    // 4. The Submit Function (Triggered by Button)
    const resetPassword = async () => {
        // Basic Validation
        if (!token) {
            toast.error("Invalid Token");
            return;
        }
        if (data.newPassword !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (data.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await axios.post("/api/user/resetpassword", {
                token: token,
                newPassword: data.newPassword
            });

            toast.success("Password reset successfully!");
            router.push("/login"); // Send them to login

        } catch (error: any) {
            const msg = error.response?.data?.error || "Reset failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50 dark:bg-gray-900">
            <div className="p-10 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-black w-full max-w-md">

                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                    Reset Password
                </h1>

                {/* New Password Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">New Password</label>
                    <input
                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors"
                        id="newPassword"
                        type="password"
                        value={data.newPassword}
                        onChange={(e) => setData({ ...data, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        disabled={loading}
                    />
                </div>

                {/* Confirm Password Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Confirm Password</label>
                    <input
                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors"
                        id="confirmPassword"
                        type="password"
                        value={data.confirmPassword}
                        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        disabled={loading}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={resetPassword}
                    disabled={loading || !token}
                    className={`w-full p-3 rounded-lg font-semibold text-white transition-all
                        ${loading || !token
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg"
                        }`}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>

                {/* Error State: If no token found */}
                {!token && (
                    <p className="mt-4 text-center text-red-500 text-sm">
                        Error: No token found in URL. Please use the link from your email.
                    </p>
                )}

            </div>
        </div>
    );
}