"use client";

import { motion } from "framer-motion";
import { Message } from "@/types";

interface QuestionCardProps {
  message: Message;
}

export function QuestionCard({ message }: QuestionCardProps) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-center gap-3 my-1 px-1"
    >
      <div className="h-px flex-1 bg-primary/15" />
      <span className="flex items-center gap-1.5 text-[10px] text-primary/50 tracking-widest uppercase font-medium whitespace-nowrap">
        <span>✦</span>
        New Question · {time}
      </span>
      <div className="h-px flex-1 bg-primary/15" />
    </motion.div>
  );
}
