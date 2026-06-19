import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  padding = "p-[15px]",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div
      className={cn(
        "bg-bg-1 border border-border-1 rounded-[11px]",
        padding,
        className,
      )}
    >
      {children}
    </div>
  );
}
