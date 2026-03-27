"use client";

import { motion } from "framer-motion";
import { Message } from "@/types";

interface SystemMessageProps {
  message: Message;
}

export function SystemMessage({ message }: SystemMessageProps) {
  return (
    <motion.div
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="self-center text-center py-1"
    >
      <span className="text-xs text-text-secondary/60">{message.content}</span>
    </motion.div>
  );
}
