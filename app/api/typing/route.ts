import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request) {
  try {
    const { roomCode, userId, userName } = await req.json();
    if (!roomCode || !userId) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    await pusherServer.trigger(`presence-room-${roomCode}`, "typing:start", {
      userId,
      userName,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
