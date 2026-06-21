import { NextResponse } from "next/server";
import { removeConnection } from "@/lib/vps-store";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await removeConnection(id);
  return NextResponse.json({ ok: true });
}
