"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function verifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [status, setStatus] = useState("Loading...");

  const verify = async (verificationToken: string) => {
    try {
      await toast.promise(
        axios.post("/api/user/verify", { rawToken: verificationToken }),
        {
          loading: "Verifying Email",
          success: "Email Verified Successfully! Redirecting...",
          error: (err) => {
            const message =
              err.response?.data?.message || "Verification failed.";
            setStatus(`Verification Failed: ${message}`);
            return message;
          },
        }
      );

      router.push("/dashboard");
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  // Extract Tokens
  useEffect(() => {
    const urlToken = searchParams.get("verifytoken");
    if (urlToken && urlToken.length > 0) {
      setToken(urlToken);
      setStatus("Token extracted. Starting verification...");
    } else {
      setStatus("Error: Verification token not found in URL.");
      console.log("Error: Verification token not found in URL.");
    }
  }, [searchParams]); //IMPORTANT

  // Run the function
  useEffect(() => {
    if (token.length > 0) {
      verify(token);
    }
  }, [token]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Email Verification</h1>
      <p>{status}</p>
    </div>
  );
}
