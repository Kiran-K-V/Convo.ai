import RoomClient from "./RoomClient";

interface RoomPageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { code } = await params;
  return <RoomClient code={code} />;
}

export function generateMetadata() {
  return {
    title: "Room — Samsarikam",
  };
}
