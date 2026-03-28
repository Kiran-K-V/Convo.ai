export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "chat" | "question" | "system";
  timestamp: number;
}

export interface Reaction {
  messageId: string;
  userId: string;
  emoji: string;
}

export interface Session {
  userId: string;
  userName: string | null;
  roomCode?: string;
  isCreator?: boolean;
}

export interface RoomMember {
  id: string;
  info: { name: string };
}

export interface TurnState {
  currentTurnUserId: string | null;
}
