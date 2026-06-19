import {
  LayoutGrid,
  Server,
  Box,
  Rocket,
  ScrollText,
  Globe,
  Lock,
  Database,
  Folder,
  Mail,
  Users,
  ClipboardList,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: "Asosiy",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutGrid },
      { href: "/servers", label: "Serverlar", icon: Server },
      { href: "/projects", label: "Loyihalar", icon: Box },
      { href: "/deploy", label: "Deploy", icon: Rocket },
      { href: "/logs", label: "Loglar", icon: ScrollText },
    ],
  },
  {
    title: "Hosting",
    items: [
      { href: "/domains", label: "Domenlar", icon: Globe, badge: "3" },
      { href: "/ssl", label: "SSL", icon: Lock },
      { href: "/databases", label: "Databaselar", icon: Database },
      { href: "/files", label: "Fayllar", icon: Folder },
      { href: "/email", label: "Email", icon: Mail },
    ],
  },
  {
    title: "Jamoa",
    items: [
      { href: "/team", label: "Sheriklar", icon: Users },
      { href: "/audit", label: "Audit", icon: ClipboardList },
      { href: "/settings", label: "Sozlamalar", icon: Settings },
    ],
  },
];

export const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/servers": "Serverlar",
  "/projects": "Loyihalar",
  "/deploy": "Deploy",
  "/logs": "Loglar",
  "/domains": "Domenlar",
  "/ssl": "SSL",
  "/databases": "Databaselar",
  "/files": "Fayllar",
  "/email": "Email",
  "/team": "Sheriklar",
  "/audit": "Audit",
  "/settings": "Sozlamalar",
};
