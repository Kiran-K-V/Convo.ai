"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOrCreateSession, updateSession } from "@/lib/session";
import { Suspense } from "react";

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode) setCode(urlCode.toUpperCase());
  }, [searchParams]);

  const handleJoin = async () => {
    const trimmedCode = code.trim().toUpperCase();
    const trimmedName = name.trim();

    if (!trimmedCode || !trimmedName || isJoining) return;

    if (trimmedCode.length !== 6) {
      setError("Room code must be 6 characters");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      const res = await fetch(`/api/room/validate/${trimmedCode}`);
      const data = await res.json();

      if (data.exists && data.memberCount >= 2) {
        setError("Room is full. Only two people can join a room.");
        setIsJoining(false);
        return;
      }

      const session = getOrCreateSession();
      updateSession({
        ...session,
        userName: trimmedName,
        roomCode: trimmedCode,
        isCreator: false,
      });

      router.push(`/room/${trimmedCode}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsJoining(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-xs text-text-secondary hover:text-foreground transition-colors mb-4 inline-flex items-center gap-1"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Join a Room</h1>
        <p className="text-sm text-text-secondary">
          Enter the room code shared with you and pick a name.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="code" className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Room Code
          </label>
          <Input
            id="code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase().slice(0, 6));
              setError("");
            }}
            placeholder="XXXXXX"
            maxLength={6}
            autoFocus
            className="h-12 rounded-xl bg-surface border-white/[0.06] text-foreground font-mono text-center text-lg tracking-[0.3em] placeholder:text-text-secondary/30 placeholder:tracking-[0.3em] focus:border-primary/50 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Your Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder="Enter your name"
            maxLength={24}
            className="h-12 rounded-xl bg-surface border-white/[0.06] text-foreground placeholder:text-text-secondary/50 focus:border-primary/50 focus:ring-primary/20"
          />
        </div>

        {error && (
          <p className="text-sm text-error">{error}</p>
        )}

        <Button
          onClick={handleJoin}
          disabled={!code.trim() || !name.trim() || isJoining}
          className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium"
        >
          {isJoining ? "Joining..." : "Join Room"}
        </Button>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center animate-gradient-bg px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,92,252,0.06)_0%,transparent_70%)]" />
      <Suspense fallback={null}>
        <JoinForm />
      </Suspense>
    </main>
  );
}
