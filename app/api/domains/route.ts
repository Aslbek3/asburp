import { NextResponse } from "next/server";
import { listNginxDomains } from "@/lib/nginx-domains";

export async function GET() {
  const domains = await listNginxDomains();
  return NextResponse.json(domains);
}
