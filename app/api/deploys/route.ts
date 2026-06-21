import { NextResponse } from "next/server";
import type { DeployRow } from "@/lib/types";
import { getPm2Processes } from "@/lib/system-metrics";

export async function GET() {
  const processes = await getPm2Processes();

  const deploys: DeployRow[] = processes
    .slice()
    .sort((a, b) => b.pm2_env.pm_uptime - a.pm2_env.pm_uptime)
    .slice(0, 8)
    .map((p) => {
      const minutesAgo = Math.floor((Date.now() - p.pm2_env.pm_uptime) / 60000);
      const time =
        minutesAgo < 60
          ? `${minutesAgo} daqiqa oldin`
          : minutesAgo < 1440
            ? `${Math.floor(minutesAgo / 60)} soat oldin`
            : `${Math.floor(minutesAgo / 1440)} kun oldin`;

      return {
        id: `pm2-${p.pm_id}`,
        project: p.name,
        branch: "pm2",
        result:
          p.pm2_env.status === "online"
            ? "success"
            : p.pm2_env.status === "errored" || p.pm2_env.status === "stopped"
              ? "failed"
              : "running",
        who: "PM2 (avtomatik)",
        time,
        canRollback: false,
      } satisfies DeployRow;
    });

  return NextResponse.json(deploys);
}
