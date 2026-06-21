import { SearchX } from "lucide-react";

export function EmptyState({
  title = "Hech narsa topilmadi",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-[10px] py-[48px] text-center">
      <div className="w-10 h-10 rounded-full bg-bg-2 flex items-center justify-center">
        <SearchX size={18} strokeWidth={1.7} className="text-text-3" />
      </div>
      <div className="text-[13px] font-medium text-text-2">{title}</div>
      {description && <div className="text-[11.5px] text-text-3 max-w-[280px]">{description}</div>}
    </div>
  );
}
