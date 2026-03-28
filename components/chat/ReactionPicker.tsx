"use client";

import { motion } from "framer-motion";

const REACTIONS = ["❤️", "😂", "🔥", "🤔", "👏", "😮"];

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute bottom-full mb-1 left-0 z-50 flex gap-1 rounded-full bg-surface-elevated border border-[#ffdede]/[0.08] px-2 py-1.5 shadow-xl"
      >
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(emoji);
            }}
            className="text-lg hover:scale-125 transition-transform px-0.5"
          >
            {emoji}
          </button>
        ))}
      </motion.div>
    </>
  );
}
