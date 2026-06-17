"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Loader2, LogOut, ShieldCheck, Mail, User as UserIcon } from "lucide-react"

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<{
        id: string;
        username: string;
        email: string;
        isVerified: boolean;
        isAdmin: boolean;
    } | null>(null)
    const [loading, setLoading] = useState(true)

    const logout = async () => {
        try {
            await axios.get("/api/user/logout")
            toast.success("Logout successful")
            router.push("/login")
        } catch (error) {
            console.error((error as Error).message)
            toast.error("Logout failed")
        }
    }

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const res = await axios.get("/api/user/me")
                setUser(res.data.data)
            } catch (error) {
                console.error((error as Error).message)
                if ((error as { response?: { status?: number } }).response?.status === 401) {
                    toast.error("Session expired, please login again")
                    router.push("/login")
                    return
                }
                toast.error("Failed to load user data")
            } finally {
                setLoading(false)
            }
        }
        getUserDetails()
    }, [router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                    <p className="text-slate-400">Welcome back, {user?.username || 'User'}</p>
                </div>
                <button
                    onClick={logout}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                    <LogOut className="size-4" />
                    Logout
                </button>
            </div>

            {/* User Card */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-900/10 rounded-xl p-8 max-w-2xl">
                <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                            <UserIcon className="size-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Username</p>
                            <p className="text-base text-slate-100">{user?.username}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                            <Mail className="size-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Email Address</p>
                            <p className="text-base text-slate-100">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                            <ShieldCheck className="size-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Account Status</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user?.isVerified ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20'}`}>
                                    {user?.isVerified ? "Verified" : "Unverified"}
                                </span>
                                {user?.isAdmin && (
                                    <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-500/20">
                                        Admin
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10">
                        <p className="text-xs text-slate-500">
                            User ID: <span className="font-mono text-slate-400">{user?.id}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
