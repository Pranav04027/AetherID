"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)

    const [data, setData] = useState({
        redirect_uri: "",
        responseType: "",
        client_id: "",
        user_Email: "",
        user_password: "",
        state: ""
    })

    useEffect(() => {
        const redirect_uri = searchParams.get("redirect_uri")
        const client_id = searchParams.get("client_id")
        const response_type = searchParams.get("response_type")
        const state = searchParams.get("state")

        if (redirect_uri && client_id && response_type) {
            setData((prev) => ({
                ...prev,
                redirect_uri: redirect_uri!,
                client_id: client_id!,
                responseType: response_type!,
                state: state || ""
            }))
        }
    }, [searchParams])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!data.user_Email || !data.user_password) {
            toast.error("Please fill in all fields")
            return
        }

        setIsLoading(true)
        try {
            const res = await axios.post("/api/user/login", {
                user_Email: data.user_Email,
                user_password: data.user_password,
                redirect_uri: data.redirect_uri,
                responseType: data.responseType,
                client_id: data.client_id
            })
            toast.success("Login successful")

            // Redirect using the provided params and code from response
            if (res?.data?.mode === "oauth") {
                let redirectUrl = `${data.redirect_uri}?${data.responseType}=${res?.data?.code}`
                if (data.state) {
                    redirectUrl += `&state=${data.state}`
                }
                router.push(redirectUrl)
            } else {

                router.push("/dashboard")
            }

        } catch (error: any) {
            console.error("Login failed", error)
            toast.error(error.response?.data?.message || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-900/20 rounded-xl p-8">
            <div className="flex flex-col space-y-2 text-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h2>
                <p className="text-sm text-slate-400">Enter your credentials to access the reality.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                        value={data.user_Email}
                        onChange={(e) => setData({ ...data, user_Email: e.target.value.trim() })}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-200" htmlFor="password">Password</label>
                        <Link
                            href="/forgotpassword"
                            className="text-xs font-medium text-emerald-500 hover:text-emerald-400 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                        value={data.user_password}
                        onChange={(e) => setData({ ...data, user_password: e.target.value.trim() })}
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-emerald-800 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-slate-400">Don't have an account? </span>
                <Link href="/signup" className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-emerald-600" /></div>}>
            <LoginContent />
        </Suspense>
    )
}