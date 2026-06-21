import { exec } from "child_process";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { promisify } from "util";
import type { DomainRow } from "./types";
import { getPublicIp } from "./system-metrics";

const execAsync = promisify(exec);
const SITES_ENABLED = "/etc/nginx/sites-enabled";

async function certDaysLeft(certPath: string): Promise<number | null> {
  try {
    const { stdout } = await execAsync(`openssl x509 -enddate -noout -in "${certPath}"`);
    const match = stdout.match(/notAfter=(.+)/);
    if (!match) return null;
    const expiry = new Date(match[1].trim());
    const days = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  } catch {
    return null;
  }
}

export async function listNginxDomains(): Promise<DomainRow[]> {
  const ip = await getPublicIp();
  let files: string[] = [];
  try {
    files = await readdir(SITES_ENABLED);
  } catch {
    return [];
  }

  const seen = new Set<string>();
  const domains: DomainRow[] = [];

  for (const file of files) {
    let content = "";
    try {
      const raw = await readFile(path.join(SITES_ENABLED, file), "utf8");
      content = raw
        .split("\n")
        .filter((line) => !line.trim().startsWith("#"))
        .join("\n");
    } catch {
      continue;
    }

    const names = new Set<string>();
    for (const match of content.matchAll(/server_name\s+([^;]+);/g)) {
      for (const n of match[1].trim().split(/\s+/)) {
        if (n !== "_" && !n.startsWith("$")) names.add(n);
      }
    }
    if (names.size === 0) continue;

    const certMatch = content.match(/ssl_certificate\s+(\S+);/);
    const hasSslBlock = /listen\s+\d+\s+ssl/.test(content);

    let ssl: DomainRow["ssl"] = "none";
    let daysLeft = 0;
    if (certMatch && hasSslBlock) {
      const days = await certDaysLeft(certMatch[1]);
      if (days !== null) {
        daysLeft = days;
        ssl = days <= 14 ? "expiring" : "active";
      } else {
        ssl = "active";
      }
    }

    for (const name of names) {
      if (seen.has(name)) continue;
      seen.add(name);
      domains.push({
        id: name,
        name,
        ip,
        ssl,
        daysLeft,
        nginx: "active",
      });
    }
  }

  return domains;
}
