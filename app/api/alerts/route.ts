import { NextResponse } from "next/server";
import { buildLiveAlerts } from "@/lib/live-alerts";

export async function GET() {
  const alerts = await buildLiveAlerts();
  return NextResponse.json(alerts);
}
