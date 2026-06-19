import { cn } from "@/lib/utils";

export function colorForPct(pct: number) {
  if (pct >= 80) return "red" as const;
  if (pct >= 60) return "amber" as const;
  return "accent" as const;
}

const colorClass: Record<"red" | "amber" | "accent" | "green", string> = {
  red: "bg-red",
  amber: "bg-amber",
  accent: "bg-accent",
  green: "bg-green",
};

export function ProgressBar({
  pct,
  color,
  className,
}: {
  pct: number;
  color?: "red" | "amber" | "accent" | "green";
  className?: string;
}) {
  const resolved = color ?? colorForPct(pct);
  return (
    <div className={cn("h-[5px] bg-bg-3 rounded-[3px] overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-[3px]", colorClass[resolved])}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}
