"use client";

import { useState, useRef, useCallback } from "react";
import { useRoomContext } from "@/context/RoomContext";

export function MessageInput() {
  const { sendMessage, sendTyping } = useRoomContext();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastTypingSentRef = useRef(0);

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustHeight();

    const now = Date.now();
    if (now - lastTypingSentRef.current > 2000) {
      lastTypingSentRef.current = now;
      sendTyping();
    }
  };

  const hasText = text.trim().length > 0;

  return (
    <div className="flex items-end gap-2 flex-1">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Message..."
        rows={1}
        className="flex-1 resize-none rounded-3xl bg-surface border border-[#ffdede]/[0.06] px-4 py-2.5 text-sm text-foreground placeholder:text-text-secondary/40 focus:outline-none focus:border-primary/25 transition-colors"
      />
      <button
        onClick={handleSend}
        disabled={!hasText}
        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
          hasText
            ? "bg-primary hover:bg-[#cf0f47] text-white shadow-md shadow-primary/20"
            : "bg-[#ffdede]/[0.04] text-text-secondary/30 cursor-not-allowed"
        }`}
      >
        <svg className="h-5 w-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
}
