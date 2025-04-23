
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash, Pencil } from "lucide-react";

interface MaterialOption {
  id: string;
  name: string;
  unit: string;
}
interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}
interface RecipeMaterialsSectionProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  materialList: MaterialOption[];
  showMaterials: boolean;
  setShowMaterials: (v: boolean) => void;
  editingMaterial: Partial<Material> | null;
  setEditingMaterial: (m: Partial<Material> | null) => void;
  handleAddMaterial: () => void;
  handleEditMaterial: (m: Material) => void;
  handleSaveMaterial: () => void;
  handleDeleteMaterial: (id: string) => void;
  disabled?: boolean;
}
export function RecipeMaterialsSection({
  materials,
  setMaterials,
  materialList,
  showMaterials,
  setShowMaterials,
  editingMaterial,
  setEditingMaterial,
  handleAddMaterial,
  handleEditMaterial,
  handleSaveMaterial,
  handleDeleteMaterial,
  disabled = false
}: RecipeMaterialsSectionProps) {
  return (
    <div>
      <button
        type="button"
        className="flex items-center w-full mb-2"
        onClick={() => setShowMaterials(!showMaterials)}
        disabled={disabled}
      >
        <span className="font-semibold text-indigo-700 pr-2">
          Materials ({materials.length})
        </span>
        <span>{showMaterials ? <Minus size={16} /> : <Plus size={16} />}</span>
      </button>
      {showMaterials && (
        <div className="mb-4 border rounded-lg bg-gray-50 p-2 space-y-2">
          <table className="w-full text-xs mb-1">
            <thead>
              <tr>
                <th className="text-left py-1 px-2">Name</th>
                <th className="text-left py-1 px-2">Quantity</th>
                <th className="text-left py-1 px-2">Unit</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {materials.map((mat) => (
                <tr key={mat.id}>
                  <td className="px-2 py-1">{mat.name}</td>
                  <td className="px-2 py-1">{mat.quantity}</td>
                  <td className="px-2 py-1">{mat.unit}</td>
                  <td className="px-2 py-1 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => handleEditMaterial(mat)}
                      disabled={disabled}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => handleDeleteMaterial(mat.id)}
                      disabled={disabled}
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editingMaterial && (
            <div className="flex gap-2 items-end">
              <Select
                value={editingMaterial.name || ""}
                onValueChange={v => {
                  const mat = materialList.find(m => m.name === v);
                  setEditingMaterial({
                    ...editingMaterial,
                    name: v,
                    unit: mat?.unit ?? (editingMaterial?.unit ?? "")
                  });
                }}
                disabled={disabled}
              >
                <SelectTrigger className="w-48 text-xs">
                  <SelectValue placeholder="Material name" />
                </SelectTrigger>
                <SelectContent>
                  {materialList.map(mat => (
                    <SelectItem key={mat.id} value={mat.name}>{mat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Qty"
                type="number"
                min={1}
                className="w-16 text-xs"
                value={editingMaterial.quantity ?? 1}
                onChange={e => setEditingMaterial({ ...editingMaterial, quantity: Number(e.target.value) })}
                disabled={disabled}
              />
              <Input
                placeholder="Unit"
                className="w-16 text-xs"
                value={editingMaterial.unit ?? ""}
                readOnly
                disabled={disabled}
              />
              <Button variant="outline" size="sm" type="button" onClick={handleSaveMaterial} disabled={disabled}>
                Save
              </Button>
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingMaterial(null)} disabled={disabled}>
                Cancel
              </Button>
            </div>
          )}
          {!editingMaterial && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="text-xs mt-1"
              onClick={handleAddMaterial}
              disabled={disabled}
            >
              <Plus className="w-3 h-3 mr-1" /> Add Material
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
