import type {
  AlertRow,
  AuditRow,
  DbRow,
  DeployPipelineStep,
  DeployRow,
  DomainRow,
  EmailAccountRow,
  FileRow,
  LogLine,
  ProjectRow,
  SslRow,
  TeamRow,
} from "./types";
import { VPS_CONTABO_ID } from "./constants";

export const projRaw: ProjectRow[] = [
  {
    id: "navbat-bot",
    name: "navbat-bot",
    type: "bot",
    vps: VPS_CONTABO_ID,
    status: "running",
    tags: ["Telegram", "Node.js"],
    lastDeploy: "2 soat oldin",
  },
  {
    id: "navbat-web",
    name: "navbat-web",
    type: "web",
    vps: VPS_CONTABO_ID,
    status: "running",
    tags: ["Next.js", "TypeScript"],
    lastDeploy: "18 daqiqa oldin",
  },
  {
    id: "core-api",
    name: "core-api",
    type: "api",
    vps: VPS_CONTABO_ID,
    status: "running",
    tags: ["FastAPI", "PostgreSQL"],
    lastDeploy: "1 kun oldin",
  },
  {
    id: "kassa-bot",
    name: "kassa-bot",
    type: "bot",
    vps: VPS_CONTABO_ID,
    status: "stopped",
    tags: ["Telegram", "Python"],
    lastDeploy: "5 kun oldin",
  },
  {
    id: "landing-uz",
    name: "landing-uz",
    type: "web",
    vps: VPS_CONTABO_ID,
    status: "running",
    tags: ["Next.js"],
    lastDeploy: "3 kun oldin",
  },
  {
    id: "analytics-api",
    name: "analytics-api",
    type: "api",
    vps: VPS_CONTABO_ID,
    status: "error",
    tags: ["FastAPI", "Redis"],
    lastDeploy: "6 soat oldin",
  },
];

export const deploys: DeployRow[] = [
  { id: "d1", project: "navbat-web", branch: "main", result: "success", who: "Aslbek", time: "18 daqiqa oldin", canRollback: true },
  { id: "d2", project: "analytics-api", branch: "main", result: "failed", who: "Sherzod", time: "6 soat oldin", canRollback: false },
  { id: "d3", project: "navbat-bot", branch: "main", result: "success", who: "Aslbek", time: "2 soat oldin", canRollback: true },
  { id: "d4", project: "core-api", branch: "develop", result: "success", who: "Aslbek", time: "1 kun oldin", canRollback: true },
  { id: "d5", project: "landing-uz", branch: "main", result: "success", who: "Sherzod", time: "3 kun oldin", canRollback: true },
  { id: "d6", project: "kassa-bot", branch: "main", result: "success", who: "Aslbek", time: "5 kun oldin", canRollback: true },
];

export const alerts: AlertRow[] = [
  { id: "a1", level: "error", text: "analytics-api jarayoni 14 marta qayta ishga tushdi", time: "6 soat oldin", href: `/servers/${VPS_CONTABO_ID}` },
  { id: "a2", level: "warning", text: "vps contabo disk hajmi 80% dan oshdi", time: "1 kun oldin", href: `/servers/${VPS_CONTABO_ID}` },
  { id: "a3", level: "warning", text: "shop.uz SSL sertifikati 12 kundan keyin tugaydi", time: "1 kun oldin", href: "/ssl" },
  { id: "a4", level: "info", text: "navbat-web muvaffaqiyatli deploy qilindi", time: "18 daqiqa oldin", href: "/deploy" },
];

export const domainRows: DomainRow[] = [
  { id: "dom1", name: "navbat.uz", ip: "194.163.45.12", ssl: "active", daysLeft: 64, nginx: "active" },
  { id: "dom2", name: "api.navbat.uz", ip: "194.163.45.12", ssl: "active", daysLeft: 64, nginx: "active" },
  { id: "dom3", name: "shop.uz", ip: "194.163.45.31", ssl: "expiring", daysLeft: 12, nginx: "active" },
  { id: "dom4", name: "landing.uz", ip: "194.163.45.31", ssl: "active", daysLeft: 78, nginx: "active" },
  { id: "dom5", name: "old-project.uz", ip: "194.163.45.58", ssl: "none", daysLeft: 0, nginx: "inactive" },
];

export const sslRows: SslRow[] = [
  { id: "s1", domain: "shop.uz", issuer: "Let's Encrypt", expiresAt: "2026-07-02", daysLeft: 12, autoRenew: true },
  { id: "s2", domain: "navbat.uz", issuer: "Let's Encrypt", expiresAt: "2026-08-23", daysLeft: 64, autoRenew: true },
  { id: "s3", domain: "api.navbat.uz", issuer: "Let's Encrypt", expiresAt: "2026-08-23", daysLeft: 64, autoRenew: true },
  { id: "s4", domain: "landing.uz", issuer: "Custom CA", expiresAt: "2026-09-06", daysLeft: 78, autoRenew: false },
];

export const dbGroups: { engine: "postgres" | "mysql"; rows: DbRow[] }[] = [
  {
    engine: "postgres",
    rows: [
      { id: "db1", engine: "postgres", name: "navbat_prod", size: "1.2 GB", user: "navbat_app", project: "navbat-web" },
      { id: "db2", engine: "postgres", name: "core_api", size: "640 MB", user: "core_app", project: "core-api" },
    ],
  },
  {
    engine: "mysql",
    rows: [
      { id: "db3", engine: "mysql", name: "kassa_db", size: "210 MB", user: "kassa_app", project: "kassa-bot" },
      { id: "db4", engine: "mysql", name: "landing_cms", size: "88 MB", user: "landing_app", project: "landing-uz" },
    ],
  },
];

export const fileRows: FileRow[] = [
  { id: "f1", name: "navbat-web", kind: "dir", size: "—", modified: "18 daqiqa oldin", perms: "755" },
  { id: "f2", name: "core-api", kind: "dir", size: "—", modified: "1 kun oldin", perms: "755" },
  { id: "f3", name: ".env", kind: "config", size: "1.4 KB", modified: "2 kun oldin", perms: "600" },
  { id: "f4", name: "nginx.conf", kind: "config", size: "3.1 KB", modified: "5 kun oldin", perms: "644" },
  { id: "f5", name: "ecosystem.config.js", kind: "code", size: "2.0 KB", modified: "9 kun oldin", perms: "644" },
  { id: "f6", name: "deploy.sh", kind: "code", size: "880 B", modified: "12 kun oldin", perms: "755" },
];

export const emailAccounts: EmailAccountRow[] = [
  { id: "e1", address: "admin@navbat.uz", usedMb: 1380, quotaMb: 2048, forwarding: "—" },
  { id: "e2", address: "support@navbat.uz", usedMb: 1820, quotaMb: 2048, forwarding: "admin@navbat.uz" },
  { id: "e3", address: "noreply@shop.uz", usedMb: 220, quotaMb: 1024, forwarding: "—" },
];

export const teamRows: TeamRow[] = [
  { id: "t1", name: "Aslbek Ismatov", email: "admin@corepanel.uz", role: "Admin", lastSeen: "hozir", twoFa: true },
  { id: "t2", name: "Sherzod Yusupov", email: "sherzod@corepanel.uz", role: "Developer", lastSeen: "2 soat oldin", twoFa: true },
  { id: "t3", name: "Dilnoza Karimova", email: "dilnoza@corepanel.uz", role: "Viewer", lastSeen: "3 kun oldin", twoFa: false },
];

export const auditRows: AuditRow[] = [
  { id: "au1", user: "Aslbek", action: "DEPLOY", target: "navbat-web", ip: "194.163.45.12", time: "18 daqiqa oldin" },
  { id: "au2", user: "Sherzod", action: "RESTART", target: "kassa-bot", ip: "194.163.45.31", time: "1 soat oldin" },
  { id: "au3", user: "Aslbek", action: "SSH", target: VPS_CONTABO_ID, ip: "194.163.45.12", time: "3 soat oldin" },
  { id: "au4", user: "Aslbek", action: "CREATE", target: "analytics-api", ip: "194.163.45.12", time: "1 kun oldin" },
  { id: "au5", user: "Sherzod", action: "DELETE", target: "old-project.uz", ip: "194.163.45.58", time: "2 kun oldin" },
];

export const deployLog: LogLine[] = [
  { id: "l1", ts: "14:02:01", level: "info", message: "$ git pull origin main" },
  { id: "l2", ts: "14:02:03", level: "info", message: "Already up to date." },
  { id: "l3", ts: "14:02:04", level: "info", message: "$ npm install" },
  { id: "l4", ts: "14:02:31", level: "info", message: "added 412 packages in 27s" },
  { id: "l5", ts: "14:02:32", level: "info", message: "$ npm run build" },
  { id: "l6", ts: "14:02:55", level: "warning", message: "warn: unused variable in app/page.tsx" },
  { id: "l7", ts: "14:03:10", level: "info", message: "Build completed successfully" },
  { id: "l8", ts: "14:03:11", level: "info", message: "$ pm2 restart navbat-web" },
  { id: "l9", ts: "14:03:12", level: "info", message: "[PM2] navbat-web restarted" },
  { id: "l10", ts: "14:03:12", level: "info", message: "Deploy muvaffaqiyatli yakunlandi ✓" },
];

export const deployHistory: DeployRow[] = deploys;

export const deployPipeline: DeployPipelineStep[] = [
  { id: "pl1", label: "Git pull", status: "done" },
  { id: "pl2", label: "Install", status: "done" },
  { id: "pl3", label: "Build", status: "active" },
  { id: "pl4", label: "Restart", status: "pending" },
];

export const logLines: LogLine[] = [
  { id: "ll1", ts: "14:12:01", level: "info", message: "GET /api/health 200 4ms" },
  { id: "ll2", ts: "14:12:03", level: "debug", message: `cache hit: servers:${VPS_CONTABO_ID}` },
  { id: "ll3", ts: "14:12:05", level: "warning", message: "rate limit nearing threshold for 194.163.45.200" },
  { id: "ll4", ts: "14:12:08", level: "error", message: "ECONNRESET on upstream redis connection" },
  { id: "ll5", ts: "14:12:10", level: "info", message: "POST /api/deploy 202 112ms" },
  { id: "ll6", ts: "14:12:14", level: "debug", message: "ws client connected: 7f2a" },
  { id: "ll7", ts: "14:12:20", level: "info", message: "GET /api/projects 200 9ms" },
  { id: "ll8", ts: "14:12:25", level: "error", message: "analytics-api crashed: out of memory" },
];

export const SETTINGS = {
  profil: { name: "Aslbek Ismatov", email: "admin@corepanel.uz", role: "Admin" },
  panel: { panelName: "CorePanel", timezone: "Europe/Berlin", language: "O'zbek" },
  bildirishnomalar: { deploy: true, alerts: true, ssl: true, weeklyReport: false },
  api: [{ id: "k1", name: "CI Token", created: "2026-03-01", lastUsed: "18 daqiqa oldin" }],
  backup: { lastBackup: "Bugun, 03:00", frequency: "Har kuni", retention: "14 kun" },
};
