"use client";

import { Link as LinkIcon, Code2, ArrowRight, ShieldCheck, Terminal, BookOpen, Key } from "lucide-react";
import Link from 'next/link';

export default function DocsPage() {
    return (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8 pb-20">
            {/* Sidebar / Navigation */}
            <div className="hidden md:block col-span-1 sticky top-8 h-fit space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl shadow-emerald-900/10">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <BookOpen className="size-4 text-emerald-500" />
                        Contents
                    </h3>
                    <nav className="space-y-1 text-sm">
                        <a href="#intro" className="block px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-900/20 transition-colors">Introduction</a>
                        <a href="#auth-flow" className="block px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-900/20 transition-colors">High-level Flow</a>
                        <a href="#authorization" className="block px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-900/20 transition-colors">Authorization</a>
                        <a href="#token-exchange" className="block px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-900/20 transition-colors">Token Exchange</a>
                        <a href="#user-info" className="block px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-900/20 transition-colors">User Info</a>
                        <a href="#client-registration" className="block px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-900/20 transition-colors">Client Registration</a>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="col-span-1 md:col-span-3 space-y-10">

                {/* Intro Section */}
                <section id="intro" className="space-y-6">
                    <div className="p-8 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-900/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Terminal className="size-8 text-emerald-500" />
                            <h1 className="text-3xl font-bold text-white">Developer Integration Guide</h1>
                        </div>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Integrate <strong>"Log in with AetherID"</strong> into your application.
                            This guide details the OAuth 2.0 Authorization Code flow implementation for third-party developers.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <div className="px-4 py-2 rounded-lg bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 text-sm font-mono flex items-center gap-2">
                                <ShieldCheck className="size-4" />
                                Base URL: https://id.example.com
                            </div>
                        </div>
                    </div>
                </section>

                {/* High Level Flow */}
                <section id="auth-flow" className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ArrowRight className="size-6 text-emerald-600" />
                        High-level Flow
                    </h2>
                    <div className="p-6 rounded-xl bg-slate-950/50 border border-slate-800/60 text-slate-300 space-y-4">
                        <p>AetherID implements the <strong>Authorization Code</strong> flow:</p>
                        <ol className="list-decimal list-inside space-y-2 text-slate-400 ml-2">
                            <li>App redirects user to AetherID login UI (<code className="text-emerald-400">GET /login</code>).</li>
                            <li>Login UI creates an <code className="text-emerald-400">authorization_code</code> and redirects back.</li>
                            <li>Backend exchanges code for token (<code className="text-emerald-400">POST /api/oauth/token</code>).</li>
                            <li>Backend requests user info (<code className="text-emerald-400">GET /api/oauth/userinfo</code>).</li>
                        </ol>
                    </div>
                </section>

                {/* Authorization */}
                <section id="authorization" className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Key className="size-6 text-emerald-600" />
                        1. Authorization
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-emerald-400">Authorization UI</h3>
                            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-sm text-slate-300">
                                GET /login?client_id=...&redirect_uri=...&response_type=code
                            </div>
                            <p className="text-sm text-slate-500">
                                Redirects to: <code className="text-slate-300">{`{redirect_uri}?code={authorization_code}`}</code>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Token Exchange */}
                <section id="token-exchange" className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Code2 className="size-6 text-emerald-600" />
                        2. Token Exchange
                    </h2>
                    <div className="space-y-6">

                        {/* Token Endpoint */}
                        <div>
                            <h3 className="text-lg font-semibold text-emerald-400 mb-2">Endpoint</h3>
                            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-sm text-slate-300">
                                POST /api/oauth/token
                            </div>
                        </div>

                        {/* Request Body */}
                        <div>
                            <h3 className="text-lg font-semibold text-emerald-400 mb-2">Request Body (JSON)</h3>
                            <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
                                <code className="text-sm font-mono text-slate-300">
                                    {`{
  "grant_type": "authorization_code",
  "code": "<raw_authorization_code>",
  "redirectUri": "https://app-a.example.com/callback",
  "clientId": "<clientId>",
  "clientSecret": "<clientSecret>"
}`}
                                </code>
                            </pre>
                        </div>

                        {/* Success Response */}
                        <div>
                            <h3 className="text-lg font-semibold text-emerald-400 mb-2">Success Response (200)</h3>
                            <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
                                <code className="text-sm font-mono text-emerald-300">
                                    {`{
  "access_token": "<jwt_access_token>",
  "token_type": "Bearer",
  "expires_in": 900,
  "refresh_token": "<jwt_refresh_token>"
}`}
                                </code>
                            </pre>
                        </div>

                    </div>
                </section>

                {/* User Info */}
                <section id="user-info" className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="size-6 text-emerald-600" />
                        3. User Info
                    </h2>
                    <div className="space-y-6">

                        <div>
                            <h3 className="text-lg font-semibold text-emerald-400 mb-2">Endpoint</h3>
                            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-sm text-slate-300">
                                GET /api/oauth/userinfo
                            </div>
                            <p className="mt-2 text-sm text-slate-400">Header: <code className="text-slate-200">Authorization: Bearer &lt;access_token&gt;</code></p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-emerald-400 mb-2">Response</h3>
                            <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
                                <code className="text-sm font-mono text-emerald-300">
                                    {`{
  "sub": "<userId>",
  "email": "user@example.com",
  "name": "user_name",
  "preferred_username": "user_name",
  "email_verified": true
}`}
                                </code>
                            </pre>
                        </div>

                    </div>
                </section>

                {/* Client Registration */}
                <section id="client-registration" className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-900/50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Client Registration</h2>
                        <Link href="/client_registration" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1">
                            Go to Console <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">
                        To get a <code className="text-emerald-400">clientId</code> and <code className="text-emerald-400">clientSecret</code>, you must register your application.
                    </p>
                    <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/50 font-mono text-sm text-slate-300">
                        POST /api/client/register
                    </div>
                </section>

            </div>
        </div>
    );
}
