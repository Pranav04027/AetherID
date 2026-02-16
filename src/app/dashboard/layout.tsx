import type { Metadata } from 'next';
import { Gem } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Dashboard | AetherID',
    description: 'Your Identity Control Center',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full bg-background font-sans text-foreground overflow-hidden">
             {/* Background Effects (Trust Mist) - reused */}
            <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-800/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-slate-800/30 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Navbar */}
                <nav className="border-b border-white/10 bg-slate-900/40 backdrop-blur-md">
                    <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                        <div className="flex items-center gap-2">
                             <div className="flex items-center justify-center p-1.5 rounded-lg bg-primary/20">
                                <Gem className="size-5 text-primary" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">AetherID</span>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 max-w-7xl mx-auto w-full p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
