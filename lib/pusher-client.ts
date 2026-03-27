import PusherClient from "pusher-js";
import { Session } from "@/types";

let pusherInstance: PusherClient | null = null;

export function getPusherClient(session: Session): PusherClient {
  if (pusherInstance) return pusherInstance;

  pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: "/api/pusher/auth",
    auth: {
      params: {
        user_id: session.userId,
        user_name: session.userName || "Anonymous",
      },
      headers: {},
    },
  });

  return pusherInstance;
}

export function disconnectPusher(): void {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
}
