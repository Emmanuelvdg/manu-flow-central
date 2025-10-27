import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrdersOnHandReportRow, OrdersOnHandSummary } from "@/types/ordersOnHand";

export const useOrdersOnHandData = () => {
  return useQuery({
    queryKey: ["orders-on-hand-report"],
    queryFn: async () => {
      // Fetch all required data in parallel
      const [materialsRes, batchesRes, allocationsRes] = await Promise.all([
        supabase.from("materials").select("*"),
        supabase.from("material_batches").select("*"),
        supabase.from("material_allocations").select("*"),
      ]);

      if (materialsRes.error) throw materialsRes.error;
      if (batchesRes.error) throw batchesRes.error;
      if (allocationsRes.error) throw allocationsRes.error;

      const materials = materialsRes.data || [];
      const batches = batchesRes.data || [];
      const allocations = allocationsRes.data || [];

      // Process data for each material
      const reportRows: OrdersOnHandReportRow[] = materials.map((material) => {
        // Get batches for this material
        const materialBatches = batches.filter((b) => b.material_id === material.id);
        
        // Calculate On Hand (received batches)
        const onHandBatches = materialBatches.filter((b) => b.status === "received");
        const onHandQuantity = onHandBatches.reduce((sum, b) => sum + Number(b.remaining_stock || 0), 0);
        const onHandValue = onHandBatches.reduce((sum, b) => sum + (Number(b.remaining_stock || 0) * Number(b.cost_per_unit || 0)), 0);
        const avgOnHandCost = onHandQuantity > 0 ? onHandValue / onHandQuantity : 0;

        // Calculate On Order (requested, expected, delayed batches)
        const onOrderBatches = materialBatches.filter((b) => 
          ["requested", "expected", "delayed"].includes(b.status)
        );
        const onOrderQuantity = onOrderBatches.reduce((sum, b) => sum + Number(b.initial_stock || 0), 0);
        const onOrderValue = onOrderBatches.reduce((sum, b) => sum + (Number(b.initial_stock || 0) * Number(b.cost_per_unit || 0)), 0);
        const avgOnOrderCost = onOrderQuantity > 0 ? onOrderValue / onOrderQuantity : 0;
        
        // Find earliest expected delivery
        const expectedDeliveryDate = onOrderBatches.length > 0
          ? onOrderBatches.reduce((earliest, b) => {
              if (!earliest || b.purchase_date < earliest) return b.purchase_date;
              return earliest;
            }, null as string | null)
          : null;

        // Calculate Allocated (booked/requested allocations)
        const materialAllocations = allocations.filter(
          (a) => a.material_id === material.id && ["booked", "requested"].includes(a.allocation_type)
        );
        const allocatedQuantity = materialAllocations.reduce((sum, a) => sum + Number(a.quantity || 0), 0);
        const allocatedValue = allocatedQuantity * avgOnHandCost;

        // Calculate Available
        const availableQuantity = onHandQuantity - allocatedQuantity;
        const availableValue = availableQuantity * avgOnHandCost;

        // Calculate Total
        const totalQuantity = onHandQuantity + onOrderQuantity;
        const totalValue = onHandValue + onOrderValue;

        // Calculate risk assessment
        // Simple heuristic: if allocated > on hand, high risk
        // if available is low relative to allocated, medium risk
        let stockoutRisk: 'low' | 'medium' | 'high' = 'low';
        const usageRate = allocatedQuantity > 0 ? allocatedQuantity / 30 : 0; // Assume 30 days
        const daysOfSupply = usageRate > 0 ? availableQuantity / usageRate : 999;

        if (availableQuantity < 0 || daysOfSupply < 7) {
          stockoutRisk = 'high';
        } else if (daysOfSupply < 14) {
          stockoutRisk = 'medium';
        }

        return {
          materialId: material.id,
          materialName: material.name,
          category: material.category || 'Uncategorized',
          unit: material.unit,
          vendor: material.vendor || 'Unknown',
          abcClassification: material.abc_classification || 'C',
          onHandQuantity,
          onHandValue,
          avgOnHandCost,
          onOrderQuantity,
          onOrderValue,
          avgOnOrderCost,
          expectedDeliveryDate,
          allocatedQuantity,
          allocatedValue,
          availableQuantity,
          availableValue,
          totalQuantity,
          totalValue,
          daysOfSupply: Math.round(daysOfSupply),
          stockoutRisk,
        };
      });

      // Calculate summary
      const summary: OrdersOnHandSummary = {
        totalOnHandValue: reportRows.reduce((sum, row) => sum + row.onHandValue, 0),
        totalOnOrderValue: reportRows.reduce((sum, row) => sum + row.onOrderValue, 0),
        totalInventoryValue: reportRows.reduce((sum, row) => sum + row.totalValue, 0),
        totalAllocatedValue: reportRows.reduce((sum, row) => sum + row.allocatedValue, 0),
        totalAvailableValue: reportRows.reduce((sum, row) => sum + row.availableValue, 0),
        materialCount: reportRows.length,
        stockoutRiskCount: {
          low: reportRows.filter((r) => r.stockoutRisk === 'low').length,
          medium: reportRows.filter((r) => r.stockoutRisk === 'medium').length,
          high: reportRows.filter((r) => r.stockoutRisk === 'high').length,
        },
      };

      return { rows: reportRows, summary };
    },
  });
};
