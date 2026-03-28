"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateRoomCode } from "@/lib/room-code";
import { getOrCreateSession, updateSession } from "@/lib/session";

export default function CreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed || isCreating) return;

    setIsCreating(true);
    const session = getOrCreateSession();
    const roomCode = generateRoomCode();

    updateSession({
      ...session,
      userName: trimmed,
      roomCode,
      isCreator: true,
    });

    router.push(`/room/${roomCode}`);
  };

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center animate-gradient-bg px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,11,85,0.05)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="text-xs text-text-secondary hover:text-foreground transition-colors mb-4 inline-flex items-center gap-1"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Create a Room</h1>
          <p className="text-sm text-text-secondary">
            Choose a name and we&apos;ll generate a room code for you.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Your Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Enter your name"
              maxLength={24}
              autoFocus
              className="h-12 rounded-xl bg-surface border-[#ffdede]/[0.06] text-foreground placeholder:text-text-secondary/50 focus:border-primary/40 focus:ring-primary/15"
            />
          </div>

          <Button
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className="h-12 rounded-xl bg-primary hover:bg-[#cf0f47] text-white font-medium transition-colors"
          >
            {isCreating ? "Creating..." : "Create Room"}
          </Button>
        </div>
      </div>
    </main>
  );
}
