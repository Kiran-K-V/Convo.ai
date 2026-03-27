"use client";

import { motion } from "framer-motion";
import { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  showName: boolean;
}

export function MessageBubble({ message, isMine, showName }: MessageBubbleProps) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

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
      <div
        className={`px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words ${
          isMine
            ? "bg-my-message text-white rounded-[18px_18px_4px_18px]"
            : "bg-their-message text-foreground rounded-[18px_18px_18px_4px]"
        }`}
      >
        {message.content}
      </div>
      <span className="text-[11px] text-text-secondary/50 px-3">{time}</span>
    </motion.div>
  );
}
