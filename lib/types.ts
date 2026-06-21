export type ServerStatus = "online" | "offline";

export interface ServerRow {
  id: string;
  name: string;
  ip: string;
  location: string;
  os: string;
  status: ServerStatus;
  tags: string[];
  cpu: number;
  ram: number;
  disk: number;
  projects: number;
  uptime: string;
  uptimePct: string;
  network: string;
  availability: string;
  load: string;
}

export type ProjectType = "bot" | "web" | "api";
export type ProjectStatus = "running" | "stopped" | "error";

export interface ProjectRow {
  id: string;
  name: string;
  type: ProjectType;
  vps: string;
  status: ProjectStatus;
  tags: string[];
  lastDeploy: string;
}

export type ProcessStatus = "online" | "stopped" | "errored";

export interface ProcessRow {
  id: string;
  pmid: number;
  name: string;
  serverId: string;
  cpu: string;
  mem: string;
  restarts: number;
  status: ProcessStatus;
  uptime: string;
}

export type DeployResult = "success" | "failed" | "running";

export interface DeployRow {
  id: string;
  project: string;
  branch: string;
  result: DeployResult;
  who: string;
  time: string;
  canRollback: boolean;
}

export type AlertLevel = "error" | "warning" | "info" | "success";

export interface AlertRow {
  id: string;
  level: AlertLevel;
  text: string;
  time: string;
  href?: string;
}

export interface DomainRow {
  id: string;
  name: string;
  ip: string;
  ssl: "active" | "expiring" | "none";
  daysLeft: number;
  nginx: "active" | "inactive";
}

export interface SslRow {
  id: string;
  domain: string;
  issuer: string;
  expiresAt: string;
  daysLeft: number;
  autoRenew: boolean;
}

export interface DbRow {
  id: string;
  engine: "postgres" | "mysql";
  name: string;
  size: string;
  user: string;
  project: string;
}

export interface FileRow {
  id: string;
  name: string;
  kind: "dir" | "config" | "code" | "file";
  size: string;
  modified: string;
  perms: string;
}

export interface EmailAccountRow {
  id: string;
  address: string;
  usedMb: number;
  quotaMb: number;
  forwarding: string;
}

export type TeamRole = "Admin" | "Developer" | "Viewer";

export interface TeamRow {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  lastSeen: string;
  twoFa: boolean;
}

export type AuditAction = "DEPLOY" | "RESTART" | "DELETE" | "SSH" | "CREATE";

export interface AuditRow {
  id: string;
  user: string;
  action: AuditAction;
  target: string;
  ip: string;
  time: string;
}

export interface LogLine {
  id: string;
  ts: string;
  level: "error" | "warning" | "info" | "debug";
  message: string;
}

export interface DeployPipelineStep {
  id: string;
  label: string;
  status: "done" | "active" | "pending";
}

export interface CpuPoint {
  t: string;
  value: number;
}
