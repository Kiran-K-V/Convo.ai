"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoomContext } from "@/context/RoomContext";

export function AnswerModal() {
  const { pendingQuestion, sendMessage, dismissAnswer } = useRoomContext();
  const [answer, setAnswer] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (pendingQuestion) {
      setAnswer("");
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [pendingQuestion]);

  const handleSend = () => {
    const trimmed = answer.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    dismissAnswer();
    setAnswer("");
  };

  return (
    <AnimatePresence>
      {pendingQuestion && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-50 bg-surface border-t border-[#ffdede]/[0.08] rounded-t-3xl shadow-2xl pb-[env(safe-area-inset-bottom)]"
        >
          <div className="flex flex-col gap-4 px-5 pt-4 pb-5 max-w-lg mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary font-medium uppercase tracking-wider">
                ✦ Question for you
              </span>
              <button
                onClick={dismissAnswer}
                className="text-text-secondary/50 hover:text-foreground text-xs transition-colors"
              >
                Skip
              </button>
            </div>

            <p className="text-base italic text-foreground/90 leading-relaxed">
              {pendingQuestion.content}
            </p>

            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your answer..."
                rows={2}
                className="flex-1 resize-none rounded-xl bg-background border border-[#ffdede]/[0.06] px-4 py-3 text-sm text-foreground placeholder:text-text-secondary/40 focus:outline-none focus:border-primary/25"
              />
              <button
                onClick={handleSend}
                disabled={!answer.trim()}
                className="flex-shrink-0 h-11 w-11 rounded-full bg-primary hover:bg-[#cf0f47] text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-md shadow-primary/20"
              >
                <svg className="h-5 w-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
