import { pusherServer } from "@/lib/pusher-server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code || code.length !== 6) {
      return Response.json(
        { exists: false, memberCount: 0, error: "Invalid room code" },
        { status: 400 }
      );
    }

    const response = await pusherServer.get({
      path: `/channels/presence-room-${code}`,
      params: { info: "user_count" },
    });

    if (response.status === 200) {
      const data = await response.json();
      return Response.json({
        exists: true,
        memberCount: data.user_count || 0,
      });
    }

    return Response.json({ exists: false, memberCount: 0 });
  } catch {
    return Response.json({ exists: false, memberCount: 0 });
  }
}
