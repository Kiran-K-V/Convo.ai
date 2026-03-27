import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request) {
  try {
    const { roomCode, senderId, senderName, content, type, messageId } =
      await req.json();

    if (!roomCode || !senderId || !content || !messageId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    await pusherServer.trigger(`presence-room-${roomCode}`, "message:new", {
      id: messageId,
      senderId,
      senderName: senderName || "Anonymous",
      content,
      type: type || "chat",
      timestamp: Date.now(),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to send message:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
