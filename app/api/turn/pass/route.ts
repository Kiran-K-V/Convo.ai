import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request) {
  try {
    const { roomCode, toUserId } = await req.json();

    if (!roomCode || !toUserId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    await pusherServer.trigger(`presence-room-${roomCode}`, "turn:changed", {
      newTurnUserId: toUserId,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to pass turn:", error);
    return Response.json({ error: "Failed to pass turn" }, { status: 500 });
  }
}
