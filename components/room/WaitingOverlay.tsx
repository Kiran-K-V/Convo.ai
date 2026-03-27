"use client";

import { useState } from "react";
import { useRoomContext } from "@/context/RoomContext";
import { UserAvatar } from "./UserAvatar";
import { toast } from "sonner";

export function WaitingOverlay() {
  const { roomCode } = useRoomContext();
  const [copied, setCopied] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  const joinLink = `${appUrl}/join?code=${roomCode}`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      toast.success("Room code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinLink);
      toast.success("Join link copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <UserAvatar name="Y" size="md" />
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1">
            <div className="h-1 w-1 rounded-full bg-primary/50 dot-bounce-1" />
            <div className="h-1 w-1 rounded-full bg-primary/50 dot-bounce-2" />
            <div className="h-1 w-1 rounded-full bg-primary/50 dot-bounce-3" />
          </div>
        </div>
        <UserAvatar name="" isGhost size="md" />
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-text-secondary">
          Share this code with a friend to start
        </p>

        <button
          onClick={copyCode}
          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-surface px-6 py-3 transition-all hover:border-primary/30 hover:bg-surface-elevated"
        >
          <span className="font-mono text-2xl tracking-[0.3em] text-foreground">
            {roomCode}
          </span>
          <span className="text-xs text-text-secondary group-hover:text-primary transition-colors">
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>

        <button
          onClick={copyLink}
          className="text-xs text-primary/70 hover:text-primary transition-colors underline underline-offset-2"
        >
          Copy join link
        </button>
      </div>

      <p className="text-[11px] text-text-secondary/50 max-w-xs text-center mt-4">
        Messages aren&apos;t saved — refreshing will clear your chat history.
      </p>
    </div>
  );
}
