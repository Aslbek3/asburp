"use client";

import { cn } from "@/lib/utils";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-1 bg-bg-2 p-[3px] rounded-[9px] border border-border-1",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "px-3 py-[5px] rounded-[6px] text-[11.5px] font-medium cursor-pointer transition-colors duration-150",
              active ? "bg-bg-1 text-text-1 shadow-none" : "bg-transparent text-text-2 hover:text-text-1",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
