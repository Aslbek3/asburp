import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[6px] bg-bg-3", className)} />;
}

export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="border-b border-border-1 last:border-b-0">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[140px]" />
        </td>
      ))}
    </tr>
  );
}
