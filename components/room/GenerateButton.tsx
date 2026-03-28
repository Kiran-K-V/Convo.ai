"use client";

import { useRoomContext } from "@/context/RoomContext";

export function GenerateButton() {
  const {
    partner,
    isMyTurn,
    isCoolingDown,
    isGenerating,
    generateQuestion,
    currentTurnUserId,
  } = useRoomContext();

  if (!currentTurnUserId || !partner) return null;

  const disabled = !isMyTurn || isCoolingDown || isGenerating;

  return (
    <div className="flex flex-col items-center gap-2 py-4 self-center w-full max-w-sm">
      <button
        onClick={generateQuestion}
        disabled={disabled}
        className={`relative w-full rounded-2xl px-6 py-4 text-sm font-medium transition-all overflow-hidden border ${
          isMyTurn && !disabled
            ? "bg-primary/10 border-primary/25 text-primary hover:bg-primary/15 shadow-lg shadow-primary/10"
            : isMyTurn && disabled
              ? "bg-primary/5 border-primary/15 text-primary/50 cursor-not-allowed"
              : "bg-[#ffdede]/[0.02] border-[#ffdede]/[0.06] text-text-secondary/60 cursor-default"
        }`}
      >
        {isMyTurn && !disabled && <div className="absolute inset-0 animate-shimmer" />}
        <span className="relative z-10 flex flex-col items-center gap-1.5">
          {isGenerating ? (
            <span className="flex items-center gap-2">
              Generating
              <span className="flex gap-0.5">
                <span className="h-1 w-1 rounded-full bg-current dot-bounce-1" />
                <span className="h-1 w-1 rounded-full bg-current dot-bounce-2" />
                <span className="h-1 w-1 rounded-full bg-current dot-bounce-3" />
              </span>
            </span>
          ) : isMyTurn ? (
            <span className="flex items-center gap-2">✦ Generate Question</span>
          ) : (
            <span className="flex items-center gap-2">
              Waiting for {partner.info.name} to ask...
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
