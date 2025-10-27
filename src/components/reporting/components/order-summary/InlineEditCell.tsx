import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InlineEditCellProps {
  value: string | number | null;
  onSave: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  maxLength?: number;
  decimalPlaces?: number;
  className?: string;
}

export const InlineEditCell: React.FC<InlineEditCellProps> = ({
  value,
  onSave,
  type = "text",
  placeholder = "Click to edit",
  maxLength = 200,
  decimalPlaces = 2,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || "");

  const handleSave = () => {
    if (editValue !== value?.toString()) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value?.toString() || "");
      setIsEditing(false);
    }
  };

  const displayValue = type === "number" && value !== null
    ? Number(value).toFixed(decimalPlaces)
    : value || "";

  if (isEditing) {
    return (
      <Input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        maxLength={maxLength}
        step={type === "number" ? Math.pow(10, -decimalPlaces) : undefined}
        className={cn("h-8 text-sm", className)}
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={() => {
        setIsEditing(true);
        setEditValue(value?.toString() || "");
      }}
      className={cn(
        "cursor-pointer px-2 py-1 rounded hover:bg-muted/50 min-h-[32px] flex items-center",
        !value && "text-muted-foreground italic",
        className
      )}
    >
      {displayValue || placeholder}
    </div>
  );
};
