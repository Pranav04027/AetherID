"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ClientRegistration() {

  const [loading, setLoading] = useState(false)

  const [redirecturi, setRedirecturi] = useState([""])

  const [Info, setInfo] = useState({
    appName: "",
    allowedRedirectUris: redirecturi,
    userEmail: "",
  });

  const onRegistration = async () => {
    try {
      setLoading(true)

      await toast.promise(
        axios.post("/api/client/register", Info),
        {
          loading: 'Registering your Client..',
          success: 'Client Registered Successfully',
          error: (err) => err.response?.data?.message || 'Error occured'
        }
      );
    } catch (error) {
      console.log("Client Registration failed", error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background font-sans p-4">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-800/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-slate-800/30 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-900/20 rounded-xl p-8 z-10">
        <h2 className="text-2xl font-bold mb-2 text-center text-white">
          Developer Registration
        </h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          Register your application to access the AetherID ecosystem.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">User Email</label>
            <input
              type="email"
              placeholder="AetherID Verified Email"
              className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              value={Info.userEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInfo({ ...Info, userEmail: e.target.value.trim() });
              }}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">App Name</label>
            <input
              type="text"
              placeholder="Your App Name"
              className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              value={Info.appName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setInfo({ ...Info, appName: e.target.value.trim() }) }}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Allowed Redirect URIs</label>
            {redirecturi.map((uri, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={uri}
                  placeholder="https://yourapp.com/callback"
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  onChange={(e) => {
                    const copy = [...redirecturi];
                    copy[index] = e.target.value;
                    setRedirecturi(copy);
                    setInfo({ ...Info, allowedRedirectUris: copy });
                  }}
                  disabled={loading}
                />
              </div>
            ))}
            <button
              className="text-xs font-medium text-emerald-500 hover:text-emerald-400 hover:underline mt-1"
              onClick={() => {
                setRedirecturi([...redirecturi, ""]);
              }}
              disabled={loading}
            >
              + Add Redirect URI
            </button>
          </div>

          <button
            className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-emerald-800 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 mt-4"
            onClick={onRegistration}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Client"}
          </button>
        </div>
      </div>
    </div>
  );
}
