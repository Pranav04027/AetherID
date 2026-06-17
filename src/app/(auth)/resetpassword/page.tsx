"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [data, setData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const urlToken = searchParams.get("resettoken");
        if (urlToken) {
            setToken(urlToken);
        } else {
            // Wait logic handled in UI, optional toast here
        }
    }, [searchParams]);

    const resetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

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
            router.push("/login");

        } catch (error) {
            const err = error as { response?: { data?: { error?: string } } };
            const msg = err.response?.data?.error || "Reset failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    if (!token && !loading && !searchParams.get("resettoken")) {
        return (
            <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-900/20 rounded-xl p-8 text-center text-red-500">
                <p>Invalid or missing reset token. Please check your email link.</p>
                <div className="mt-6 text-center text-sm">
                    <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-900/20 rounded-xl p-8">
            <div className="flex flex-col space-y-2 text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-white">Set New Password</h1>
                <p className="text-sm text-slate-400">Enter and confirm your new password below.</p>
            </div>

            <form onSubmit={resetPassword} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200" htmlFor="newPassword">New Password</label>
                    <input
                        id="newPassword"
                        type="password"
                        className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                        value={data.newPassword}
                        onChange={(e) => setData({ ...data, newPassword: e.target.value })}
                        placeholder="New password"
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                        value={data.confirmPassword}
                        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                        placeholder="Confirm password"
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !token}
                    className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-emerald-800 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-emerald-600" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}