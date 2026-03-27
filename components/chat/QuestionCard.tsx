"use client";

import { motion } from "framer-motion";
import { Message } from "@/types";

interface QuestionCardProps {
  message: Message;
}

export function QuestionCard({ message }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="self-center w-full max-w-md mx-auto my-2"
    >
      <div className="question-card-bg rounded-2xl border border-question-border p-5 animate-pulse-glow">
        <div className="flex items-start gap-3">
          <span className="text-primary text-lg flex-shrink-0 mt-0.5">✦</span>
          <p className="text-[17px] italic leading-relaxed text-foreground/90">
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
