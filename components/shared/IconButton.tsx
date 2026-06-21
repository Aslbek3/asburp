"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Hover = "default" | "accent" | "danger";

const hoverClass: Record<Hover, string> = {
  default: "hover:bg-bg-2",
  accent: "hover:bg-accent-soft hover:text-accent",
  danger: "hover:bg-red-soft hover:text-red",
};

export function IconButton({
  icon: Icon,
  title,
  onClick,
  hover = "default",
  size = 26,
  className,
}: {
  icon: LucideIcon;
  title?: string;
  onClick?: () => void;
  hover?: Hover;
  size?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      style={{ width: size, height: size }}
      className={cn(
        "flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 cursor-pointer transition-colors duration-150",
        hoverClass[hover],
        className,
      )}
    >
      <Icon size={Math.round(size * 0.5)} strokeWidth={1.8} />
    </button>
  );
}
