"use client";

import { useRoomContext } from "@/context/RoomContext";

export function GenerateButton() {
  const {
    partner,
    isMyTurn,
    isCoolingDown,
    isGenerating,
    generateQuestion,
  } = useRoomContext();

  if (!isMyTurn) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.04] px-4 py-3 text-sm text-text-secondary/50 cursor-not-allowed w-full sm:w-auto"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        {partner?.info.name || "Partner"}&apos;s turn
      </button>
    );
  }

  const disabled = isCoolingDown || isGenerating;

  return (
    <button
      onClick={generateQuestion}
      disabled={disabled}
      className={`relative flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all w-full sm:w-auto overflow-hidden ${
        disabled
          ? "bg-primary/20 text-primary/50 cursor-not-allowed"
          : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
      }`}
    >
      {!disabled && <div className="absolute inset-0 animate-shimmer" />}
      <span className="relative z-10 flex items-center gap-2">
        {isGenerating ? (
          <>
            Thinking
            <span className="flex gap-0.5">
              <span className="h-1 w-1 rounded-full bg-current dot-bounce-1" />
              <span className="h-1 w-1 rounded-full bg-current dot-bounce-2" />
              <span className="h-1 w-1 rounded-full bg-current dot-bounce-3" />
            </span>
          </>
        ) : (
          <>✦ Generate Question</>
        )}
      </span>
    </button>
  );
}
