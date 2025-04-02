import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface IngredientChipProps {
  name: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function IngredientChip({
  name,
  selected = false,
  onClick,
  onRemove,
  className,
}: IngredientChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "transition-all text-sm px-3 py-1.5 rounded-full flex items-center",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-primary/20 border border-border",
        className
      )}
      onClick={onClick}
    >
      {name}
      {selected && onRemove && (
        <button
          type="button"
          className="ml-1.5 text-primary-foreground opacity-70 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X size={14} />
        </button>
      )}
    </button>
  );
}
