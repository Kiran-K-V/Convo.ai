"use client";

import { motion } from "framer-motion";

interface UserAvatarProps {
  name: string;
  isGhost?: boolean;
  size?: "sm" | "md";
}

export function UserAvatar({ name, isGhost = false, size = "sm" }: UserAvatarProps) {
  const initial = name ? name[0].toUpperCase() : "?";
  const sizeClasses = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  if (isGhost) {
    return (
      <div
        className={`${sizeClasses} rounded-full border border-dashed border-[#ffdede]/15 flex items-center justify-center text-text-secondary animate-ghost-pulse`}
      >
        ?
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`${sizeClasses} rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-medium text-primary`}
    >
      {initial}
    </motion.div>
  );
}
