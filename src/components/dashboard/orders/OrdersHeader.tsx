
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CardHeader, CardTitle } from "@/components/ui/card";

export const OrdersHeader = () => {
  const navigate = useNavigate();

  const handleCreateOrder = () => {
    navigate('/quotes');
  };

  return (
    <CardHeader className="flex flex-row items-center justify-between border-b pb-4 pt-5">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">Manufacturing orders</span>
        <Button size="sm" className="ml-4 flex items-center" onClick={handleCreateOrder}>
          <Plus className="w-4 h-4 mr-2" />
          Create
        </Button>
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
