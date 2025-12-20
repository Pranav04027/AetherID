"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const onForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/user/forgotpassword", { email });
            toast.success("Password reset link sent to your email!");
            console.log("Forgot password response:", response.data);
        } catch (error: any) {
            const msg = error.response?.data?.message || "Something went wrong";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50 dark:bg-gray-900">
            <div className="p-10 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-black w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                    Forgot Password
                </h1>
                <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email Address</label>
                    <input
                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        placeholder="yourname@example.com"
                        disabled={loading}
                    />
                </div>

                <button
                    onClick={onForgotPassword}
                    disabled={loading}
                    className={`w-full p-3 rounded-lg font-semibold text-white transition-all mb-4
                        ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg"
                        }`}
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </div>
        </div>
    );
}
