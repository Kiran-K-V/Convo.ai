"use client";

import { useState, useRef, useCallback } from "react";
import { useRoomContext } from "@/context/RoomContext";

export function MessageInput() {
  const { sendMessage } = useRoomContext();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, []);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 flex-1">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          adjustHeight();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Message..."
        rows={1}
        className="flex-1 resize-none rounded-xl bg-surface border border-white/[0.06] px-4 py-3 text-sm text-foreground placeholder:text-text-secondary/40 focus:outline-none focus:border-primary/30 transition-colors"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="flex-shrink-0 h-[44px] w-[44px] rounded-xl bg-primary/80 hover:bg-primary text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
        </svg>
      </button>
    </div>
  );
}
