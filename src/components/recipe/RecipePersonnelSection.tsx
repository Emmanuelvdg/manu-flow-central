
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash, Pencil } from "lucide-react";

interface PersonnelRoleOption {
  id: string;
  role: string;
}
interface Personnel {
  id: string;
  role: string;
  hours: number;
}
interface RecipePersonnelSectionProps {
  personnel: Personnel[];
  personnelRoleList: PersonnelRoleOption[];
  showPersonnel: boolean;
  setShowPersonnel: (show: boolean) => void;
  editingPersonnel: Partial<Personnel> | null;
  setEditingPersonnel: (p: Partial<Personnel> | null) => void;
  handleAddPersonnel: () => void;
  handleEditPersonnel: (p: Personnel) => void;
  handleSavePersonnel: () => void;
  handleDeletePersonnel: (id: string) => void;
}
export function RecipePersonnelSection({
  personnel,
  personnelRoleList,
  showPersonnel,
  setShowPersonnel,
  editingPersonnel,
  setEditingPersonnel,
  handleAddPersonnel,
  handleEditPersonnel,
  handleSavePersonnel,
  handleDeletePersonnel
}: RecipePersonnelSectionProps) {
  return (
    <div>
      <button
        type="button"
        className="flex items-center w-full mb-2"
        onClick={() => setShowPersonnel(!showPersonnel)}
      >
        <span className="font-semibold text-green-700 pr-2">Personnel ({personnel.length})</span>
        <span>{showPersonnel ? <Minus size={16} /> : <Plus size={16} />}</span>
      </button>
      {showPersonnel && (
        <div className="mb-4 border rounded-lg bg-gray-50 p-2 space-y-2">
          <table className="w-full text-xs mb-1">
            <thead>
              <tr>
                <th className="text-left py-1 px-2">Role</th>
                <th className="text-left py-1 px-2">Hours</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {personnel.map((pers) => (
                <tr key={pers.id}>
                  <td className="px-2 py-1">{pers.role}</td>
                  <td className="px-2 py-1">{pers.hours}</td>
                  <td className="px-2 py-1 flex gap-1">
                    <Button variant="ghost" size="icon" type="button" onClick={() => handleEditPersonnel(pers)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" type="button" onClick={() => handleDeletePersonnel(pers.id)}>
                      <Trash className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editingPersonnel && (
            <div className="flex gap-2 items-end">
              <Select
                value={editingPersonnel.role || ""}
                onValueChange={v => setEditingPersonnel({ ...editingPersonnel, role: v })}
              >
                <SelectTrigger className="w-48 text-xs">
                  <SelectValue placeholder="Personnel role" />
                </SelectTrigger>
                <SelectContent>
                  {personnelRoleList.map(pers => (
                    <SelectItem key={pers.id} value={pers.role}>{pers.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Hours"
                type="number"
                min={1}
                className="w-16 text-xs"
                value={editingPersonnel.hours ?? 1}
                onChange={e => setEditingPersonnel({ ...editingPersonnel, hours: Number(e.target.value) })}
              />
              <Button variant="outline" size="sm" type="button" onClick={handleSavePersonnel}>
                Save
              </Button>
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingPersonnel(null)}>
                Cancel
              </Button>
            </div>
          )}
          {!editingPersonnel && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="text-xs mt-1"
              onClick={handleAddPersonnel}
            >
              <Plus className="w-3 h-3 mr-1" /> Add Personnel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
