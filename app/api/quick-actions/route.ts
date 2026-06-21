import { NextResponse } from "next/server";
import { exec } from "child_process";
import { readFile } from "fs/promises";
import { promisify } from "util";

const execAsync = promisify(exec);

async function run(action: string): Promise<{ ok: boolean; message: string }> {
  switch (action) {
    case "nginx": {
      try {
        const { stderr } = await execAsync("nginx -t");
        return { ok: true, message: stderr.trim().split("\n").pop() ?? "nginx config OK" };
      } catch (e) {
        const err = e as { stderr?: string; message: string };
        return { ok: false, message: (err.stderr ?? err.message).trim().split("\n").pop() ?? "nginx config xato" };
      }
    }
    case "firewall": {
      try {
        const { stdout } = await execAsync("ufw status");
        const status = stdout.match(/Status:\s*(\w+)/)?.[1] ?? "noma'lum";
        const ruleCount = stdout.trim().split("\n").length - (stdout.includes("Status") ? 4 : 0);
        return { ok: true, message: `UFW: ${status}, ~${Math.max(ruleCount, 0)} qoida` };
      } catch {
        return { ok: false, message: "ufw o'rnatilmagan yoki ruxsat yo'q" };
      }
    }
    case "cron": {
      try {
        const { stdout } = await execAsync("crontab -l");
        const count = stdout.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#")).length;
        return { ok: true, message: `${count} ta cron job (root)` };
      } catch {
        return { ok: true, message: "Cron job yo'q (root uchun)" };
      }
    }
    case "pm2-save": {
      try {
        await execAsync("pm2 save");
        return { ok: true, message: "PM2 process ro'yxati saqlandi (dump.pm2)" };
      } catch {
        return { ok: false, message: "pm2 save muvaffaqiyatsiz" };
      }
    }
    case "ssh-keys": {
      try {
        const raw = await readFile("/root/.ssh/authorized_keys", "utf8");
        const count = raw.split("\n").filter((l) => l.trim().startsWith("ssh-")).length;
        return { ok: true, message: `${count} ta SSH public key authorized_keys da` };
      } catch {
        return { ok: true, message: "authorized_keys fayli topilmadi" };
      }
    }
    default:
      return { ok: false, message: "Noma'lum amal" };
  }
}

export async function POST(request: Request) {
  const { action } = await request.json();
  const result = await run(action);
  return NextResponse.json(result);
}
