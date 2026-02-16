import type { Metadata } from 'next';
import { Gem } from 'lucide-react';

export const metadata: Metadata = {
    title: 'AetherID',
    description: 'Identity, without noise',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background font-sans">
            {/* Background Effects (Trust Mist) */}
            <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-800/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-slate-800/30 blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center gap-8 p-4">
                {/* Header Section */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex items-center justify-center p-3 rounded-xl bg-primary shadow-lg shadow-primary/40">
                        <Gem className="size-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        AetherID
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground">
                        Identity, without noise
                    </p>
                </div>

                {/* Auth Content */}
                {children}
            </div>
        </div>
    );
}
