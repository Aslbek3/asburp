"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dropdown({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label?: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 h-[32px] px-3 border border-border-1 rounded-lg bg-bg-2 text-[12px] cursor-pointer hover:border-border-2",
          className,
        )}
      >
        {label ? `${label}: ${value}` : value}
        <ChevronDown size={13} className={cn("text-text-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-[6px] z-50 min-w-[160px] bg-bg-1 border border-border-1 rounded-lg shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "w-full px-[10px] py-[8px] text-left text-[12px] cursor-pointer",
                opt === value ? "bg-accent-soft text-accent" : "hover:bg-bg-2 text-text-1",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
