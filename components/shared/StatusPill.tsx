import { cn } from "@/lib/utils";

type Tone = "green" | "amber" | "red" | "accent" | "purple" | "neutral";

const toneMap: Record<Tone, { bg: string; color: string; dotBg: string }> = {
  green: { bg: "bg-green-soft", color: "text-green", dotBg: "bg-green" },
  amber: { bg: "bg-amber-soft", color: "text-amber", dotBg: "bg-amber" },
  red: { bg: "bg-red-soft", color: "text-red", dotBg: "bg-red" },
  accent: { bg: "bg-accent-soft", color: "text-accent", dotBg: "bg-accent" },
  purple: { bg: "bg-purple-soft", color: "text-purple", dotBg: "bg-purple" },
  neutral: { bg: "bg-bg-3", color: "text-text-2", dotBg: "bg-text-3" },
};

export function StatusPill({
  tone,
  label,
  dot = true,
  pulse = false,
  className,
}: {
  tone: Tone;
  label: string;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}) {
  const t = toneMap[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[5px] px-2 py-[2px] rounded-full",
        t.bg,
        className,
      )}
    >
      {dot && (
        <span
          className={cn("w-[6px] h-[6px] rounded-full", t.dotBg, pulse && "cp-pulse")}
        />
      )}
      <span className={cn("text-[10px] font-semibold", t.color)}>{label}</span>
    </span>
  );
}
