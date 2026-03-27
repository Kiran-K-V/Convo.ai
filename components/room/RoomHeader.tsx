"use client";

import { useRoomContext } from "@/context/RoomContext";
import { UserAvatar } from "./UserAvatar";

export function RoomHeader() {
  const { roomCode, session, members, isConnected, partner } = useRoomContext();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-surface/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-text-secondary tracking-widest">
          {roomCode}
        </span>
        <div className="h-3 w-px bg-white/10" />
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

      <div className="flex items-center gap-2">
        <div
          className={`h-1.5 w-1.5 rounded-full ${
            isConnected ? "bg-success" : "bg-error"
          }`}
        />
        <span className="text-[10px] text-text-secondary">
          {isConnected ? "Connected" : "Connecting..."}
        </span>
      </div>
    </header>
  );
}
