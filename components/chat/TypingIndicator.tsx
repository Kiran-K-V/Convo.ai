"use client";

import { useRoomContext } from "@/context/RoomContext";

export function TypingIndicator() {
  const { isPartnerTyping, partner } = useRoomContext();

  if (!isPartnerTyping || !partner) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 self-start">
      <span className="text-xs text-text-secondary/60">
        {partner.info.name} is typing
      </span>
      <span className="flex gap-0.5">
        <span className="h-1 w-1 rounded-full bg-text-secondary/40 dot-bounce-1" />
        <span className="h-1 w-1 rounded-full bg-text-secondary/40 dot-bounce-2" />
        <span className="h-1 w-1 rounded-full bg-text-secondary/40 dot-bounce-3" />
      </span>
    </div>
  );
}
