"use client";

import { useRoomContext } from "@/context/RoomContext";

export function TurnIndicator() {
  const {
    partner,
    isMyTurn,
    currentTurnUserId,
    hasRespondedSinceLastQuestion,
    passTurn,
  } = useRoomContext();

  if (!currentTurnUserId) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#ffdede]/[0.04] bg-surface/50">
      <span className="text-xs text-text-secondary">
        {isMyTurn ? (
          <span className="text-primary font-medium">✦ Your turn to ask</span>
        ) : (
          <span>✦ {partner?.info.name || "Partner"}&apos;s turn to ask</span>
        )}
      </span>

      {isMyTurn && hasRespondedSinceLastQuestion && (
        <button
          onClick={passTurn}
          className="text-xs text-text-secondary hover:text-primary transition-colors"
        >
          Pass Turn →
        </button>
      )}
    </div>
  );
}
