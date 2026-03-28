"use client";

import { useRoomContext } from "@/context/RoomContext";
import { UserAvatar } from "./UserAvatar";

export function RoomHeader() {
  const { roomCode, session, isConnected, partner, questionCount } = useRoomContext();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[#ffdede]/[0.06] bg-surface/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-text-secondary tracking-widest">
          {roomCode}
        </span>
        <div className="h-3 w-px bg-[#ffdede]/10" />
        <div className="flex items-center -space-x-1.5">
          <UserAvatar name={session.userName || "You"} />
          {partner ? (
            <UserAvatar name={partner.info.name} />
          ) : (
            <UserAvatar name="" isGhost />
          )}
        </div>
        {partner && (
          <span className="text-xs text-text-secondary hidden sm:inline">
            with <span className="text-foreground">{partner.info.name}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {questionCount > 0 && (
          <span className="text-[10px] text-primary/70 bg-primary/10 rounded-full px-2 py-0.5 font-medium">
            Q{questionCount}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isConnected ? "bg-success" : "bg-error"
            }`}
          />
          <span className="text-[10px] text-text-secondary">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
      </div>
    </header>
  );
}
