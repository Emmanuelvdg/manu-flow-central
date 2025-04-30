
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { RoutingStage } from "./RoutingTable";

interface RoutingStageFormValues {
  stage_name: string;
  description: string;
}

interface RoutingStageDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: RoutingStageFormValues) => void;
  initialValues?: RoutingStage;
}

export const RoutingStageDialog: React.FC<RoutingStageDialogProps> = ({
  open,
  onClose,
  onSave,
  initialValues,
}) => {
  const isEditing = !!initialValues?.id;
  const title = isEditing ? "Edit Routing Stage" : "Add Routing Stage";
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoutingStageFormValues>({
    defaultValues: initialValues || {
      stage_name: "",
      description: "",
    }
  });

  React.useEffect(() => {
    if (open) {
      reset(initialValues || {
        stage_name: "",
        description: "",
      });
    }
  }, [open, initialValues, reset]);

  const onSubmit = (data: RoutingStageFormValues) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="stage_name">Stage Name</Label>
              <Input
                id="stage_name"
                {...register("stage_name", { required: "Stage name is required" })}
                placeholder="Enter stage name"
              />
              {errors.stage_name && (
                <p className="text-sm text-red-500">{errors.stage_name.message}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter stage description (optional)"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
