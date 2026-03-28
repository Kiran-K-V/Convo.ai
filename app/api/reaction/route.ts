import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request) {
  try {
    const { roomCode, messageId, userId, emoji } = await req.json();
    if (!roomCode || !messageId || !userId || !emoji) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    await pusherServer.trigger(`presence-room-${roomCode}`, "reaction:new", {
      messageId,
      userId,
      emoji,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
