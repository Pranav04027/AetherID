import Link from "next/link";
import { Gem, Shield, Zap, Globe, Lock, Code2, ArrowRight, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-950 font-sans text-slate-50 selection:bg-emerald-500/30">

      {/* --- BACKGROUND FX --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-emerald-800/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-slate-800/30 blur-[120px]" />
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/20">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-800 shadow-lg shadow-emerald-800/20">
              <Gem className="size-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">AetherID</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-emerald-800 px-4 text-sm font-medium text-white shadow-lg shadow-emerald-800/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-800/40"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center">

        {/* --- HERO SECTION --- */}
        <section className="w-full pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            v1.0 is now live
          </div>

          <div className="flex items-center justify-center p-4 rounded-2xl bg-emerald-900/20 mb-6 shadow-2xl shadow-emerald-500/10">
            <Gem className="size-12 text-emerald-400" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400 mb-6 max-w-4xl">
            Identity is <span className="text-emerald-500">Trust</span>.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Charcoal disappears. Emerald reassures.
            AetherID should feel like infrastructure you never question.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-800 px-8 text-base font-semibold text-white shadow-lg shadow-emerald-800/25 transition-all hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/50 px-8 text-base font-medium text-slate-300 shadow-sm transition-all hover:bg-slate-800 hover:text-white hover:border-slate-600"
            >
              <Code2 className="mr-2 size-4" />
              Read Documentation
            </Link>
          </div>

          {/* Code Preview Mockup */}
          <div className="w-full max-w-3xl rounded-xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-emerald-900/10 backdrop-blur-md overflow-hidden text-left">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <div className="ml-4 text-xs text-slate-500 font-mono">token-exchange.ts</div>
            </div>
            <div className="p-6 font-mono text-sm overflow-x-auto">
              <div className="text-slate-400">
                <span className="text-emerald-400">const</span> response = <span className="text-emerald-400">await</span> axios.post(<span className="text-green-400">"/api/oauth/token"</span>, {"{"}
              </div>
              <div className="pl-4 text-slate-300">
                grant_type: <span className="text-green-400">"authorization_code"</span>,
              </div>
              <div className="pl-4 text-slate-300">
                code: <span className="text-blue-400">authCode</span>,
              </div>
              <div className="pl-4 text-slate-300">
                client_id: <span className="text-green-400">process.env.CLIENT_ID</span>
              </div>
              <div className="text-slate-400">{"}"});</div>
              <div className="mt-4 text-slate-500">// Returns Access & Refresh Tokens</div>
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="w-full py-24 px-6 border-t border-white/5 bg-slate-900/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Engineered for Security</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Built on industry standards to ensure your user data remains strictly confidential and secure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Lock className="size-6 text-rose-500" />}
                title="OAuth 2.0 Compliant"
                description="Full implementation of the Authorization Code flow with PKCE support readiness."
              />
              <FeatureCard
                icon={<Shield className="size-6 text-rose-500" />}
                title="Token Rotation"
                description="Refresh tokens are rotated on every use, preventing replay attacks and theft."
              />
              <FeatureCard
                icon={<Zap className="size-6 text-rose-500" />}
                title="Stateless JWTs"
                description="Access tokens are cryptographically signed and stateless for maximum scalability."
              />
              <FeatureCard
                icon={<Globe className="size-6 text-rose-500" />}
                title="OIDC UserInfo"
                description="Standardized user profile endpoints compatible with NextAuth and Passport.js."
              />
              <FeatureCard
                icon={<Code2 className="size-6 text-rose-500" />}
                title="Developer Friendly"
                description="Comprehensive documentation and type-safe API responses for easy integration."
              />
              <FeatureCard
                icon={<Gem className="size-6 text-rose-500" />}
                title="Self-Hosted Control"
                description="Own your data. No third-party black boxes. Full database control via MongoDB."
              />
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="w-full py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-12 rounded-3xl relative overflow-hidden">
            {/* Glow effect behind CTA */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-800/20 blur-[100px] rounded-full pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
              Ready to claim your identity?
            </h2>
            <p className="text-slate-400 mb-8 relative z-10">
              Join the developers building the next generation of secure applications.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-emerald-800 px-8 text-base font-semibold text-white shadow-lg shadow-emerald-800/25 transition-all hover:bg-emerald-700"
              >
                Get Started Now
              </Link>
              <Link
                href="https://github.com/Pranav04027/AetherID"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-8 text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                <Github className="mr-2 size-4" />
                View on GitHub
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-white/5 py-8 bg-slate-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Gem className="size-4 text-slate-400" />
            <span>&copy; {new Date().getFullYear()} AetherID.</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Helper Component for Features
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-6 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-slate-900 hover:border-emerald-500/30 transition-all duration-300">
      <div className="mb-4 p-3 rounded-lg bg-slate-950 w-fit border border-white/5 group-hover:border-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-900/20 transition-all">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-slate-200 group-hover:text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}