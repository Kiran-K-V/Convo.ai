"use client";

import { createContext, useContext } from "react";
import { Session, RoomMember, Message, Reaction } from "@/types";

interface RoomContextValue {
  session: Session;
  roomCode: string;
  members: RoomMember[];
  messages: Message[];
  reactions: Reaction[];
  isConnected: boolean;
  partner: RoomMember | null;
  currentTurnUserId: string | null;
  isMyTurn: boolean;
  hasRespondedSinceLastQuestion: boolean;
  isCoolingDown: boolean;
  isGenerating: boolean;
  isPartnerTyping: boolean;
  pendingQuestion: Message | null;
  questionCount: number;
  sendMessage: (content: string) => void;
  generateQuestion: () => void;
  passTurn: () => void;
  dismissAnswer: () => void;
  sendTyping: () => void;
  addReaction: (messageId: string, emoji: string) => void;
}

const RoomContext = createContext<RoomContextValue | null>(null);

export function RoomProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: RoomContextValue;
}) {
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoomContext() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoomContext must be used within RoomProvider");
  return ctx;
}
