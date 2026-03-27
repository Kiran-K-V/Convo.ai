import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const socketId = params.get("socket_id")!;
  const channel = params.get("channel_name")!;
  const userId = params.get("user_id") || crypto.randomUUID();
  const userName = params.get("user_name") || "Anonymous";

  const authResponse = pusherServer.authorizeChannel(socketId, channel, {
    user_id: userId,
    user_info: { name: userName },
  });

  return Response.json(authResponse);
}
