"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  const verify = async (verificationToken: string) => {
    try {
      await axios.post("/api/user/verify", { rawToken: verificationToken });
      setStatus("success");
      setMessage("Email Verified Successfully!");
      // Optional: Auto redirect
      // setTimeout(() => router.push('/login'), 3000);
    } catch (error: any) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Verification failed");
    }
  };

  useEffect(() => {
    const urlToken = searchParams.get("verifytoken");
    if (urlToken && urlToken.length > 0) {
      setToken(urlToken);
      verify(urlToken);
    } else {
      setStatus("error");
      setMessage("No verification token found.");
    }
  }, [searchParams]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-900/20 rounded-xl p-8 flex flex-col items-center text-center">

        <div className="mb-6">
          {status === "loading" && (
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          )}
          {status === "error" && (
            <XCircle className="h-12 w-12 text-destructive" />
          )}
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          {status === "loading" ? "Verifying..." : status === "success" ? "Verified!" : "Verification Failed"}
        </h1>

        <p className="text-sm text-slate-400 mb-8">
          {message}
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-emerald-800 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          Login Now
        </Link>
      </div>

      <p className="mt-8 text-xs text-center text-gray-400">
        &copy; {new Date().getFullYear()} AetherID Inc. All rights reserved.
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-emerald-600" /></div>}>
      <VerifyContent />
    </Suspense>
  )
}
