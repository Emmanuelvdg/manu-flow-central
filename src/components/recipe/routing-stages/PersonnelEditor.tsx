
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Personnel } from "../types/recipeMappingTypes";

interface PersonnelEditorProps {
  editingPersonnel: Partial<Personnel>;
  personnelRoleList: any[];
  setEditingPersonnel: (personnel: Partial<Personnel> | null) => void;
  handleSavePersonnel: () => void;
  disabled?: boolean;
}

const PersonnelEditor: React.FC<PersonnelEditorProps> = ({
  editingPersonnel,
  personnelRoleList,
  setEditingPersonnel,
  handleSavePersonnel,
  disabled = false
}) => {
  return (
    <div className="flex gap-2 items-end border-t pt-2 mt-2">
      <Select
        value={editingPersonnel.role || ""}
        onValueChange={v => setEditingPersonnel({ ...editingPersonnel, role: v })}
        disabled={disabled}
      >
        <SelectTrigger className="w-48 text-xs">
          <SelectValue placeholder="Personnel role" />
        </SelectTrigger>
        <SelectContent>
          {personnelRoleList.map(role => (
            <SelectItem key={role.id} value={role.role}>{role.role}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Hours"
        type="number"
        min={0.1}
        step={0.1}
        className="w-16 text-xs"
        value={editingPersonnel.hours ?? 1}
        onChange={e => setEditingPersonnel({ ...editingPersonnel, hours: Number(e.target.value) })}
        disabled={disabled}
      />
      <Button variant="outline" size="sm" type="button" onClick={handleSavePersonnel} disabled={disabled}>
        Save
      </Button>
      <Button variant="ghost" size="sm" type="button" onClick={() => setEditingPersonnel(null)} disabled={disabled}>
        Cancel
      </Button>
    </div>
  );
};

export default PersonnelEditor;
