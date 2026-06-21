import { readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const STORE_PATH = path.join(process.cwd(), "data", "vps-connections.json");

export interface VpsConnection {
  id: string;
  name: string;
  ip: string;
  port: number;
  sshUser: string;
  addedAt: string;
}

export async function listConnections(): Promise<VpsConnection[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as VpsConnection[];
  } catch {
    return [];
  }
}

async function saveConnections(connections: VpsConnection[]): Promise<void> {
  await writeFile(STORE_PATH, JSON.stringify(connections, null, 2));
}

export async function addConnection(input: {
  name: string;
  ip: string;
  port: number;
  sshUser: string;
}): Promise<VpsConnection> {
  const connections = await listConnections();
  const connection: VpsConnection = {
    id: `vps-${randomUUID().slice(0, 8)}`,
    name: input.name,
    ip: input.ip,
    port: input.port,
    sshUser: input.sshUser,
    addedAt: new Date().toISOString(),
  };
  connections.push(connection);
  await saveConnections(connections);
  return connection;
}

export async function removeConnection(id: string): Promise<void> {
  const connections = await listConnections();
  await saveConnections(connections.filter((c) => c.id !== id));
}
