import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden animate-gradient-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,92,252,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-text-secondary font-mono">
              Live Conversations
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent">
            Samsarikam
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-md leading-relaxed">
            Two people. Real questions. Honest answers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/create"
            className="relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-primary/90 animate-pulse-glow"
          >
            <span className="text-base">Create a Room</span>
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-8 py-3.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:text-white hover:border-white/20"
          >
            <span className="text-base">Join a Room</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          {[
            { icon: "✦", label: "AI Questions" },
            { icon: "⟳", label: "Turn-Based" },
            { icon: "◎", label: "Private Rooms" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 text-xs text-text-secondary"
            >
              <span className="text-primary/80">{icon}</span>
              {label}
            </span>
          ))}
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-text-secondary/50">
        Messages are ephemeral — nothing is stored.
      </footer>
    </main>
  );
}
