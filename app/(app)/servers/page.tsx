import { SummaryBar } from "@/components/servers/SummaryBar";
import { ServerFilters } from "@/components/servers/ServerFilters";
import { ServerCardGrid } from "@/components/servers/ServerCardGrid";
import { DetailPanel } from "@/components/servers/DetailPanel";

export default function ServersPage() {
  return (
    <div className="flex flex-col gap-[14px]">
      <SummaryBar />
      <ServerFilters />
      <ServerCardGrid />
      <DetailPanel />
    </div>
  );
}
