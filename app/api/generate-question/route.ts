import { pusherServer } from "@/lib/pusher-server";
import { generateQuestion } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { roomCode, requesterId, requesterName } = await req.json();

    if (!roomCode || !requesterId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [questionText] = await Promise.all([generateQuestion()]);

    const questionMessage = {
      id: crypto.randomUUID(),
      senderId: "system",
      senderName: "Samsarikam",
      content: questionText,
      type: "question" as const,
      timestamp: Date.now(),
    };

    await pusherServer.trigger(
      `presence-room-${roomCode}`,
      "message:new",
      questionMessage
    );

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to generate question:", error);
    return Response.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
