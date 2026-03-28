"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/types";
import { useRoomContext } from "@/context/RoomContext";
import { ReactionPicker } from "./ReactionPicker";

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  showName: boolean;
}

export function MessageBubble({ message, isMine, showName }: MessageBubbleProps) {
  const { reactions, addReaction } = useRoomContext();
  const [showPicker, setShowPicker] = useState(false);

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const messageReactions = reactions.filter((r) => r.messageId === message.id);

  const groupedReactions = messageReactions.reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.emoji] = (acc[r.emoji] || 0) + 1;
      return acc;
    },
    {}
  );

  const handleReact = (emoji: string) => {
    addReaction(message.id, emoji);
    setShowPicker(false);
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col gap-0.5 max-w-[80%] ${
        isMine ? "self-end items-end" : "self-start items-start"
      }`}
    >
      {showName && !isMine && (
        <span className="text-[11px] text-text-secondary ml-3 mb-0.5">
          {message.senderName}
        </span>
      )}
      <div className="relative group">
        <div
          onDoubleClick={() => setShowPicker((p) => !p)}
          className={`px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words cursor-default ${
            isMine
              ? "bg-my-message text-white rounded-[18px_18px_4px_18px]"
              : "bg-their-message text-foreground rounded-[18px_18px_18px_4px]"
          }`}
        >
          {message.content}
        </div>

        {/* Reaction trigger on hover */}
        <button
          onClick={() => setShowPicker((p) => !p)}
          className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-text-secondary/40 hover:text-text-secondary ${
            isMine ? "-left-7" : "-right-7"
          }`}
        >
          😊
        </button>

        <AnimatePresence>
          {showPicker && (
            <ReactionPicker
              onSelect={handleReact}
              onClose={() => setShowPicker(false)}
            />
          )}
        </AnimatePresence>

        {Object.keys(groupedReactions).length > 0 && (
          <div className={`flex gap-0.5 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
            {Object.entries(groupedReactions).map(([emoji, count]) => (
              <span
                key={emoji}
                className="inline-flex items-center gap-0.5 rounded-full bg-[#ffdede]/[0.06] border border-[#ffdede]/[0.06] px-1.5 py-0.5 text-xs"
              >
                {emoji}
                {count > 1 && <span className="text-[10px] text-text-secondary">{count}</span>}
              </span>
            ))}
          </div>
        )}
      </div>
      <span className="text-[11px] text-text-secondary/50 px-3">{time}</span>
    </motion.div>
  );
}
