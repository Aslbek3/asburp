import { ServerDetailView } from "@/components/servers/ServerDetailView";

export default async function ServerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServerDetailView id={id} />;
}
