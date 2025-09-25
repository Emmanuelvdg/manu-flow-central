
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Printer } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { NewOrderForm } from "./NewOrderForm";

export const OrdersHeader = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <CardHeader className="flex flex-row items-center justify-between border-b pb-4 pt-5">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">Manufacturing work orders</span>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="ml-4 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[480px] sm:w-[540px]">
            <SheetHeader className="pb-4">
              <SheetTitle>Create New Work Order</SheetTitle>
            </SheetHeader>
            <NewOrderForm onClose={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost">
          <Printer className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost">
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </CardHeader>
  );
};
