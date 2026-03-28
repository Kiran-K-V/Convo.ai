"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRoomContext } from "@/context/RoomContext";

export function QuestionHeader() {
  const { messages, session, partner, currentTurnUserId } = useRoomContext();

  const latestQuestion = [...messages]
    .reverse()
    .find((m) => m.type === "question");

  if (!latestQuestion) return null;

  const responderName =
    currentTurnUserId === session.userId
      ? "You"
      : partner?.info.name ?? "Partner";

  const isMe = currentTurnUserId === session.userId;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={latestQuestion.id}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden border-b border-[#ffdede]/[0.06]"
      >
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0008] to-[#000000]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,11,85,0.1),transparent)]" />

        <div className="relative px-5 pt-4 pb-3.5">
          {/* Eyebrow label */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] uppercase text-primary/60">
              <span className="text-primary">✦</span>
              Question
            </span>

            {/* Responder pill */}
            <motion.span
              key={responderName}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${
                isMe
                  ? "bg-primary/10 border-primary/25 text-primary"
                  : "bg-[#ffdede]/5 border-[#ffdede]/10 text-text-secondary"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isMe ? "bg-primary animate-pulse" : "bg-text-secondary/50"
                }`}
              />
              {isMe ? "Your turn to answer" : `${responderName} answers`}
            </motion.span>
          </div>

          {/* Question text */}
          <p className="text-[16px] sm:text-[17px] font-light leading-snug tracking-[-0.01em] text-foreground/90 pr-2">
            {latestQuestion.content}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
