import { NextResponse } from "next/server";
import { getCpuSeries } from "@/lib/cpu-sampler";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range");
  const validRange = range === "1h" || range === "24h" || range === "7d" ? range : "1h";
  return NextResponse.json(getCpuSeries(validRange));
}
