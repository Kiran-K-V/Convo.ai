"use client";

import { useState, useCallback, useRef } from "react";
import { Message } from "@/types";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageIdsRef = useRef(new Set<string>());

  const addMessage = useCallback((message: Message) => {
    if (messageIdsRef.current.has(message.id)) return;
    messageIdsRef.current.add(message.id);
    setMessages((prev) => [...prev, message]);
  }, []);

  const addSystemMessage = useCallback(
    (content: string) => {
      const msg: Message = {
        id: crypto.randomUUID(),
        senderId: "system",
        senderName: "System",
        content,
        type: "system",
        timestamp: Date.now(),
      };
      addMessage(msg);
    },
    [addMessage]
  );

  return { messages, addMessage, addSystemMessage };
}
