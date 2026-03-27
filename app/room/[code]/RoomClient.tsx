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
import { TurnIndicator } from "@/components/room/TurnIndicator";
import { GenerateButton } from "@/components/room/GenerateButton";
import { MessageInput } from "@/components/room/MessageInput";
import { ChatArea } from "@/components/chat/ChatArea";
import { Session, RoomMember, Message } from "@/types";
import { toast } from "sonner";

interface RoomClientProps {
  code: string;
}

export default function RoomClient({ code }: RoomClientProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const isCreatorRef = useRef(false);

  const { messages, addMessage, addSystemMessage } = useMessages();

  const userId = session?.userId || "";
  const turnState = useTurnState(userId);

  const onMessageReceived = useCallback(
    (message: Message) => {
      addMessage(message);
      if (message.type === "question") {
        turnState.onQuestionGenerated();
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

  const { members, isConnected, getPartner } = useRoom({
    roomCode: code,
    session: session || { userId: "", userName: null },
    onMessageReceived,
    onTurnChanged: turnState.onTurnChanged,
    onMemberAdded,
    onMemberRemoved,
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

  const generateQuestion = useCallback(() => {
    if (!session || turnState.isGenerating || turnState.isCoolingDown) return;

    turnState.startGenerating();

    fetch("/api/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomCode: code,
        requesterId: session.userId,
        requesterName: session.userName,
      }),
    }).catch(() => {
      toast.error("Failed to generate question");
    });
  }, [session, code, turnState]);

  const passTurn = useCallback(() => {
    const partner = getPartner();
    if (!partner) return;

    fetch("/api/turn/pass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomCode: code,
        toUserId: partner.id,
      }),
    }).catch(() => toast.error("Failed to pass turn"));
  }, [code, getPartner]);

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
  const showWaiting = members.length < 2 && !partnerDisconnected;

  return (
    <RoomProvider
      value={{
        session,
        roomCode: code,
        members,
        messages,
        isConnected,
        partner: partner || null,
        currentTurnUserId: turnState.currentTurnUserId,
        isMyTurn: turnState.isMyTurn,
        hasRespondedSinceLastQuestion: turnState.hasRespondedSinceLastQuestion,
        isCoolingDown: turnState.isCoolingDown,
        isGenerating: turnState.isGenerating,
        sendMessage,
        generateQuestion,
        passTurn,
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

        <TurnIndicator />

        <div className="flex flex-col sm:flex-row items-stretch gap-2 px-4 py-3 border-t border-white/[0.06] bg-surface/50 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <GenerateButton />
          <MessageInput />
        </div>
      </div>
    </RoomProvider>
  );
}
