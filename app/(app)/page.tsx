import { MetricsRow } from "@/components/dashboard/MetricsRow";
import { CpuChart } from "@/components/dashboard/CpuChart";
import { ProcessList } from "@/components/dashboard/ProcessList";
import { DeploysTable } from "@/components/dashboard/DeploysTable";
import { AlertsFeed } from "@/components/dashboard/AlertsFeed";
import { DomainsMini } from "@/components/dashboard/DomainsMini";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-[14px]">
      <MetricsRow />
      <div className="grid grid-cols-1 desktop:grid-cols-[1fr_322px] gap-[14px] items-start">
        <div className="flex flex-col gap-[14px] min-w-0">
          <CpuChart />
          <ProcessList />
          <DeploysTable />
        </div>
        <div className="flex flex-col gap-[14px] min-w-0">
          <AlertsFeed />
          <DomainsMini />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
