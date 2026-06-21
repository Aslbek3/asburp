import { NextResponse } from "next/server";
import { addConnection, listConnections } from "@/lib/vps-store";

export async function GET() {
  const connections = await listConnections();
  return NextResponse.json(connections);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, ip, port, sshUser } = body;

  if (!name || !ip || !sshUser) {
    return NextResponse.json({ error: "name, ip va sshUser shart" }, { status: 400 });
  }

  const connection = await addConnection({
    name,
    ip,
    port: Number(port) || 22,
    sshUser,
  });

  return NextResponse.json(connection, { status: 201 });
}
