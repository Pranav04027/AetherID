"use client";

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: '',
        password: '',
        username: ''
    })
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [loading, setLoading] = useState(false)

    const onSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user.username || !user.email || !user.password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!agreedToTerms) {
            toast.error("You must agree to the Terms and Privacy Policy");
            return;
        }

        try {
            setLoading(true)
            await axios.post("/api/user/signup", user);
            toast.success("Account created! Please verify your email.");
            router.push("/login"); // Redirect to login after successful signup

        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            console.log("Signup failed", error);
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-900/20 rounded-xl p-8">
                <div className="flex flex-col space-y-2 text-center mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Create an Account</h2>
                    <p className="text-sm text-slate-400">Join the reality. Enter your details below.</p>
                </div>

                <form onSubmit={onSignup} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="jdoe"
                            className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value.trim() })}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value.trim() })}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value.trim() })}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center space-x-2 py-2">
                        <input
                            id="terms"
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-700 bg-slate-950/50 text-emerald-600 focus:ring-emerald-600 cursor-pointer accent-emerald-600"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            disabled={loading}
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm text-slate-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I agree to the <Link href="/terms" className="text-slate-200 hover:text-emerald-500 underline underline-offset-2">Terms</Link> and <Link href="/privacy" className="text-slate-200 hover:text-emerald-500 underline underline-offset-2">Privacy Policy</Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-emerald-800 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-slate-400">Already have an account? </span>
                    <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline">
                        Login
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-xs text-center text-gray-400">
                &copy; {new Date().getFullYear()} AetherID Inc. All rights reserved.
            </p>
        </div>
    )
}