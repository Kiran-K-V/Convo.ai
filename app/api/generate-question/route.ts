import { pusherServer } from "@/lib/pusher-server";
import { generateQuestion } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { roomCode, requesterId, requesterName, previousQuestions } = await req.json();

    if (!roomCode || !requesterId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const questionText = await generateQuestion(
      Array.isArray(previousQuestions) ? previousQuestions : []
    );

    const questionMessage = {
      id: crypto.randomUUID(),
      senderId: requesterId,
      senderName: requesterName || "Someone",
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
