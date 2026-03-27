"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Channel, PresenceChannel } from "pusher-js";
import { getPusherClient, disconnectPusher } from "@/lib/pusher-client";
import { Session, RoomMember, Message } from "@/types";

interface UseRoomOptions {
  roomCode: string;
  session: Session;
  onMessageReceived: (message: Message) => void;
  onTurnChanged: (newTurnUserId: string) => void;
  onMemberAdded: (member: RoomMember) => void;
  onMemberRemoved: (member: RoomMember) => void;
}

export function useRoom({
  roomCode,
  session,
  onMessageReceived,
  onTurnChanged,
  onMemberAdded,
  onMemberRemoved,
}: UseRoomOptions) {
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<Channel | null>(null);

  const getPartner = useCallback(() => {
    return members.find((m) => m.id !== session.userId) || null;
  }, [members, session.userId]);

  useEffect(() => {
    if (!roomCode || !session.userId || !session.userName) return;

    const pusher = getPusherClient(session);
    const channelName = `presence-room-${roomCode}`;
    const channel = pusher.subscribe(channelName) as PresenceChannel;
    channelRef.current = channel;

    channel.bind("pusher:subscription_succeeded", (members: { each: (fn: (member: { id: string; info: { name: string } }) => void) => void; me: { id: string; info: { name: string } } }) => {
      setIsConnected(true);

      const memberList: RoomMember[] = [];
      members.each((member) => {
        memberList.push({ id: member.id, info: { name: member.info.name } });
      });
      setMembers(memberList);

      // If joining an already-occupied room, fire onMemberAdded for the pre-existing partner
      const myId = members.me?.id || session.userId;
      const existingPartner = memberList.find((m) => m.id !== myId);
      if (existingPartner) {
        onMemberAdded(existingPartner);
      }
    });

    channel.bind("pusher:member_added", (member: { id: string; info: { name: string } }) => {
      const newMember: RoomMember = {
        id: member.id,
        info: { name: member.info.name },
      };
      setMembers((prev) => {
        if (prev.some((m) => m.id === newMember.id)) return prev;
        return [...prev, newMember];
      });
      onMemberAdded(newMember);
    });

    channel.bind("pusher:member_removed", (member: { id: string; info: { name: string } }) => {
      const removed: RoomMember = {
        id: member.id,
        info: { name: member.info.name },
      };
      setMembers((prev) => prev.filter((m) => m.id !== removed.id));
      onMemberRemoved(removed);
    });

    channel.bind("message:new", (message: Message) => {
      onMessageReceived(message);
    });

    channel.bind("turn:changed", (data: { newTurnUserId: string }) => {
      onTurnChanged(data.newTurnUserId);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      disconnectPusher();
      setIsConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, session.userId, session.userName]);

  return { members, isConnected, getPartner };
}
