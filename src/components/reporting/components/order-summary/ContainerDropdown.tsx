import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContainerDropdownProps {
  value: '20"' | '40"' | '40HC' | null;
  onSave: (value: string) => void;
}

export const ContainerDropdown: React.FC<ContainerDropdownProps> = ({
  value,
  onSave,
}) => {
  return (
    <Select
      value={value || "none"}
      onValueChange={(newValue) => {
        if (newValue === "none") {
          onSave("");
        } else {
          onSave(newValue);
        }
      }}
    >
      <SelectTrigger className="h-8 text-sm w-full">
        <SelectValue placeholder="Select container" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">-</SelectItem>
        <SelectItem value='20"'>20"</SelectItem>
        <SelectItem value='40"'>40"</SelectItem>
        <SelectItem value="40HC">40HC</SelectItem>
      </SelectContent>
    </Select>
  );
};
