"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const onForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
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
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-900/20 rounded-xl p-8">
            <div className="flex flex-col space-y-2 text-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
                <p className="text-sm text-slate-400">Enter your email to receive recovery instructions.</p>
            </div>

            <form onSubmit={onForgotPassword} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200" htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        placeholder="name@example.com"
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-emerald-800 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
