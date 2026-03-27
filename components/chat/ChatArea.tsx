"use client";

import { useRef, useEffect, useCallback } from "react";
import { useRoomContext } from "@/context/RoomContext";
import { MessageBubble } from "./MessageBubble";
import { QuestionCard } from "./QuestionCard";
import { QuestionHeader } from "./QuestionHeader";
import { SystemMessage } from "./SystemMessage";

export function ChatArea() {
  const { messages, session } = useRoomContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const hasQuestion = messages.some((m) => m.type === "question");

  const checkIsAtBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 80;
    isAtBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {hasQuestion && <QuestionHeader />}

      <div
        ref={scrollRef}
        onScroll={checkIsAtBottom}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-text-secondary/40 text-center">
              When a question is generated, it will appear here.
              <br />
              Start the conversation!
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.type === "system") {
            return <SystemMessage key={msg.id} message={msg} />;
          }
          if (msg.type === "question") {
            return <QuestionCard key={msg.id} message={msg} />;
          }

          const isMine = msg.senderId === session.userId;
          const prevMsg = i > 0 ? messages[i - 1] : null;
          const showName =
            !isMine &&
            (!prevMsg ||
              prevMsg.senderId !== msg.senderId ||
              prevMsg.type !== "chat");

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMine={isMine}
              showName={showName}
            />
          );
        })}
      </div>
    </div>
  );
}
