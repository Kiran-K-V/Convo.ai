"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { useRoom } from "@/hooks/useRoom";
import { useMessages } from "@/hooks/useMessages";
import { useTurnState } from "@/hooks/useTurnState";
import { RoomProvider } from "@/context/RoomContext";
import { RoomHeader } from "@/components/room/RoomHeader";
import { WaitingOverlay } from "@/components/room/WaitingOverlay";
import { MessageInput } from "@/components/room/MessageInput";
import { AnswerModal } from "@/components/room/AnswerModal";
import { ChatArea } from "@/components/chat/ChatArea";
import { Session, RoomMember, Message, Reaction } from "@/types";
import { toast } from "sonner";

interface RoomClientProps {
  code: string;
}

export default function RoomClient({ code }: RoomClientProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<Message | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const isCreatorRef = useRef(false);
  const generateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const turnRef = useRef<string | null>(null);

  const { messages, addMessage, addSystemMessage } = useMessages();

  const userId = session?.userId || "";
  const turnState = useTurnState(userId);

  // Keep a ref to the current turn so callbacks can read it without stale closure
  useEffect(() => {
    turnRef.current = turnState.currentTurnUserId;
  }, [turnState.currentTurnUserId]);

  const questionCount = messages.filter((m) => m.type === "question").length;

  const onMessageReceived = useCallback(
    (message: Message) => {
      addMessage(message);
      if (message.type === "question") {
        if (generateTimeoutRef.current) {
          clearTimeout(generateTimeoutRef.current);
          generateTimeoutRef.current = null;
        }
        turnState.onQuestionGenerated();

        // Show answer modal for the person who did NOT generate (will be the new turn holder after auto-pass)
        // The generator auto-passes turn, so the receiver should answer
        setPendingQuestion(message);
      }
    },
    [addMessage, turnState]
  );

  const onMemberAdded = useCallback(
    (member: RoomMember) => {
      addSystemMessage(`${member.info.name} joined the room ✦`);
      setPartnerDisconnected(false);

      if (isCreatorRef.current && session) {
        fetch("/api/turn/pass", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomCode: code,
            toUserId: session.userId,
          }),
        });
      }
    },
    [addSystemMessage, code, session]
  );

  const onMemberRemoved = useCallback(
    (member: RoomMember) => {
      addSystemMessage(`${member.info.name} left the room`);
      setPartnerDisconnected(true);
    },
    [addSystemMessage]
  );

  const onTyping = useCallback(
    (_userId: string) => {
      setIsPartnerTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsPartnerTyping(false), 2500);
    },
    []
  );

  const onReaction = useCallback((reaction: Reaction) => {
    setReactions((prev) => {
      const existing = prev.find(
        (r) => r.messageId === reaction.messageId && r.userId === reaction.userId && r.emoji === reaction.emoji
      );
      if (existing) return prev;
      return [...prev, reaction];
    });
  }, []);

  const { members, isConnected, getPartner } = useRoom({
    roomCode: code,
    session: session || { userId: "", userName: null },
    onMessageReceived,
    onTurnChanged: turnState.onTurnChanged,
    onMemberAdded,
    onMemberRemoved,
    onTyping,
    onReaction,
  });

  useEffect(() => {
    const s = getSession();
    if (!s || !s.userName) {
      router.replace(`/join?code=${code}`);
      return;
    }
    setSession(s);
    isCreatorRef.current = s.isCreator === true;
  }, [code, router]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!session) return;

      const messageId = crypto.randomUUID();
      const msg: Message = {
        id: messageId,
        senderId: session.userId,
        senderName: session.userName || "Anonymous",
        content,
        type: "chat",
        timestamp: Date.now(),
      };

      addMessage(msg);
      turnState.onMessageSent();

      fetch("/api/message/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: code,
          senderId: session.userId,
          senderName: session.userName,
          content,
          type: "chat",
          messageId,
        }),
      }).catch(() => toast.error("Failed to send message"));
    },
    [session, code, addMessage, turnState]
  );

  const generateQuestion = useCallback(async () => {
    if (!session || turnState.isGenerating || turnState.isCoolingDown) return;

    turnState.startGenerating();

    generateTimeoutRef.current = setTimeout(() => {
      generateTimeoutRef.current = null;
      turnState.stopGenerating();
      toast.error("Question generation timed out. Please try again.");
    }, 15000);

    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: code,
          requesterId: session.userId,
          requesterName: session.userName,
        }),
      });

      if (res.ok) {
        // Auto-pass turn to partner after question generated
        const partner = getPartner();
        if (partner) {
          await fetch("/api/turn/pass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomCode: code, toUserId: partner.id }),
          });
        }
      } else {
        if (generateTimeoutRef.current) {
          clearTimeout(generateTimeoutRef.current);
          generateTimeoutRef.current = null;
        }
        turnState.stopGenerating();
        toast.error("Failed to generate question");
      }
    } catch {
      if (generateTimeoutRef.current) {
        clearTimeout(generateTimeoutRef.current);
        generateTimeoutRef.current = null;
      }
      turnState.stopGenerating();
      toast.error("Failed to generate question");
    }
  }, [session, code, turnState, getPartner]);

  const passTurn = useCallback(() => {
    const partner = getPartner();
    if (!partner) return;

    fetch("/api/turn/pass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode: code, toUserId: partner.id }),
    }).catch(() => toast.error("Failed to pass turn"));
  }, [code, getPartner]);

  const dismissAnswer = useCallback(() => {
    setPendingQuestion(null);
  }, []);

  const sendTyping = useCallback(() => {
    if (!session) return;
    fetch("/api/typing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomCode: code,
        userId: session.userId,
        userName: session.userName,
      }),
    }).catch(() => {});
  }, [session, code]);

  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!session) return;
      const reaction: Reaction = { messageId, userId: session.userId, emoji };
      setReactions((prev) => {
        const existing = prev.find(
          (r) => r.messageId === messageId && r.userId === session.userId && r.emoji === emoji
        );
        if (existing) return prev;
        return [...prev, reaction];
      });
      fetch("/api/reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomCode: code, messageId, userId: session.userId, emoji }),
      }).catch(() => {});
    },
    [session, code]
  );

  if (!session) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-primary dot-bounce-1" />
          <div className="h-2 w-2 rounded-full bg-primary dot-bounce-2" />
          <div className="h-2 w-2 rounded-full bg-primary dot-bounce-3" />
        </div>
      </div>
    );
  }

  const partner = getPartner();
  const showWaiting = !partner && !partnerDisconnected && isConnected;

  return (
    <RoomProvider
      value={{
        session,
        roomCode: code,
        members,
        messages,
        reactions,
        isConnected,
        partner: partner || null,
        currentTurnUserId: turnState.currentTurnUserId,
        isMyTurn: turnState.isMyTurn,
        hasRespondedSinceLastQuestion: turnState.hasRespondedSinceLastQuestion,
        isCoolingDown: turnState.isCoolingDown,
        isGenerating: turnState.isGenerating,
        isPartnerTyping,
        pendingQuestion,
        questionCount,
        sendMessage,
        generateQuestion,
        passTurn,
        dismissAnswer,
        sendTyping,
        addReaction,
      }}
    >
      <div className="flex flex-col h-dvh bg-background">
        <RoomHeader />

        <div className="relative flex-1 flex flex-col overflow-hidden">
          {showWaiting && <WaitingOverlay />}

          {partnerDisconnected && (
            <div className="px-4 py-2 bg-error/10 border-b border-error/20 text-center">
              <span className="text-xs text-error">
                Your partner disconnected. Waiting for them to return...
              </span>
            </div>
          )}

          <ChatArea />
        </div>

        <div className="flex items-end gap-2 px-3 py-2.5 border-t border-[#ffdede]/[0.06] bg-surface/50 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
          <MessageInput />
        </div>

        <AnswerModal />
      </div>
    </RoomProvider>
  );
}
