
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProductMarginData {
  productId: string;
  productName: string;
  orderCount: number;
  totalRevenue: number;
  totalCost: number;
  totalGrossMargin: number;
  averageGrossMarginPercentage: number;
}

export interface AgingBucket {
  name: string;
  count: number;
  value: number;
}

export interface FinancialData {
  grossMarginByProduct: ProductMarginData[];
  agingData: AgingBucket[];
  wipTotal: number;
  totalOrders: number;
  totalRevenue: number;
  invoicesPaid: number;
  invoicesUnpaid: number;
}

export const useFinancialData = (dateRange: 'week' | 'month' | 'quarter' | 'year') => {
  // Calculate date range for filtering
  const calculateDateRange = () => {
    console.log("Calculating date range:", dateRange);
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }
    
    console.log("Date range calculated:", {
      range: dateRange,
      from: startDate.toISOString(),
      to: now.toISOString()
    });
    
    return startDate.toISOString();
  };

  const startDate = calculateDateRange();
  
  // Fetch financial data
  return useQuery({
    queryKey: ['financial-analysis', dateRange],
    queryFn: async () => {
      console.log("Starting financial data fetch for dateRange:", dateRange);
      
      try {
        // Get orders in date range
        console.log("Fetching orders...");
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            order_products(*)
          `)
          .gte('created_at', startDate);
        
        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
          throw ordersError;
        }
        
        console.log(`Fetched ${orders?.length || 0} orders`);
        
        // Get invoices
        console.log("Fetching invoices...");
        const { data: invoices, error: invoicesError } = await supabase
          .from('invoices')
          .select('*')
          .gte('created_at', startDate);
        
        if (invoicesError) {
          console.error("Error fetching invoices:", invoicesError);
          throw invoicesError;
        }
        
        console.log(`Fetched ${invoices?.length || 0} invoices`);
        
        // Get recipes for cost data
        console.log("Fetching recipes for cost data...");
        const { data: recipes, error: recipesError } = await supabase
          .from('recipes')
          .select('*');
        
        if (recipesError) {
          console.error("Error fetching recipes:", recipesError);
          throw recipesError;
        }
        
        console.log(`Fetched ${recipes?.length || 0} recipes`);
        
        if (!orders) {
          console.log("No orders found in the specified date range");
          return null;
        }
        
        console.log("Processing product margins data...");
        
        // Product lines with gross margin
        const productGroups: Record<string, ProductMarginData> = {};
        
        console.log("Order processing details:");
        orders.forEach((order, orderIndex) => {
          console.log(`Processing order ${orderIndex + 1}/${orders.length}:`, {
            orderId: order.id,
            orderNumber: order.order_number,
            total: order.total,
            productsCount: order.order_products?.length || 0
          });
          
          if (order.order_products && order.order_products.length > 0) {
            order.order_products.forEach((product) => {
              const productId = product.product_id;
              const recipeId = product.recipe_id;
              
              console.log("Processing product:", {
                productId,
                recipeId,
              });
              
              // Find matching recipe for cost data
              const recipe = recipes?.find(r => r.id === recipeId);
              const productCost = recipe ? recipe.totalCost : 0;
              
              console.log("Product cost details:", {
                recipeFound: !!recipe,
                productCost,
              });
              
              // Calculate revenue (using order total as approximation)
              const revenue = order.total ? (order.total / (order.order_products?.length || 1)) : 0;
              const costOfSales = productCost || 0;
              const grossMargin = revenue - costOfSales;
              const grossMarginPercentage = revenue > 0 ? (grossMargin / revenue) * 100 : 0;
              
              console.log("Product financial calculations:", {
                revenue,
                costOfSales,
                grossMargin,
                grossMarginPercentage
              });
              
              // Group by product ID
              if (!productGroups[productId]) {
                productGroups[productId] = {
                  productId,
                  productName: product.product_id, // Try to get a better name later
                  orderCount: 0,
                  totalRevenue: 0,
                  totalCost: 0,
                  totalGrossMargin: 0,
                  averageGrossMarginPercentage: 0
                };
                
                console.log("Created new product group for:", productId);
              }
              
              productGroups[productId].orderCount++;
              productGroups[productId].totalRevenue += revenue;
              productGroups[productId].totalCost += costOfSales;
              productGroups[productId].totalGrossMargin += grossMargin;
              
              console.log("Updated product group:", {
                productId,
                newOrderCount: productGroups[productId].orderCount,
                newTotalRevenue: productGroups[productId].totalRevenue,
                newTotalCost: productGroups[productId].totalCost,
                newTotalGrossMargin: productGroups[productId].totalGrossMargin
              });
            });
          } else {
            console.log(`Order ${order.order_number || order.id} has no products`);
          }
        });
        
        // Calculate averages
        console.log("Calculating product group averages...");
        Object.values(productGroups).forEach(group => {
          group.averageGrossMarginPercentage = 
            group.totalRevenue > 0 ? (group.totalGrossMargin / group.totalRevenue) * 100 : 0;
        });
        
        // Convert to array and sort by margin
        const grossMarginByProduct = Object.values(productGroups)
          .sort((a, b) => b.totalGrossMargin - a.totalGrossMargin);
        
        console.log(`Processed ${grossMarginByProduct.length} products with margin data`);
        console.log("Sample product data:", grossMarginByProduct.slice(0, 2));
        
        // Invoice aging analysis
        console.log("Processing invoice aging data...");
        const agingBuckets: Record<string, AgingBucket> = {
          'current': { name: 'Current', count: 0, value: 0 },
          '1-30': { name: '1-30 Days', count: 0, value: 0 },
          '31-60': { name: '31-60 Days', count: 0, value: 0 },
          '61-90': { name: '61-90 Days', count: 0, value: 0 },
          '90+': { name: 'Over 90 Days', count: 0, value: 0 }
        };
        
        if (invoices) {
          const now = new Date();
          
          console.log("Processing invoices for aging buckets...");
          invoices.forEach(invoice => {
            if (!invoice.paid && invoice.due_date) {
              const dueDate = new Date(invoice.due_date);
              const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
              
              let bucket;
              if (daysDiff <= 0) {
                bucket = 'current';
              } else if (daysDiff <= 30) {
                bucket = '1-30';
              } else if (daysDiff <= 60) {
                bucket = '31-60';
              } else if (daysDiff <= 90) {
                bucket = '61-90';
              } else {
                bucket = '90+';
              }
              
              agingBuckets[bucket].count++;
              agingBuckets[bucket].value += invoice.amount || 0;
              
              console.log(`Invoice ${invoice.invoice_number} added to ${bucket} bucket`);
            }
          });
        }
        
        // Convert to array for chart
        const agingData = Object.values(agingBuckets);
        
        // WIP Valuation
        console.log("Calculating WIP total...");
        const wipTotal = orders
          .filter(order => ['in_progress', 'processing'].includes(order.status))
          .reduce((sum, order) => sum + (order.total || 0), 0);
        
        console.log("WIP total:", wipTotal);
        
        // Prepare final data object
        const result = {
          grossMarginByProduct,
          agingData,
          wipTotal,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
          invoicesPaid: invoices?.filter(inv => inv.paid).length || 0,
          invoicesUnpaid: invoices?.filter(inv => !inv.paid).length || 0
        } as FinancialData;
        
        console.log("Financial data processing complete");
        return result;
      } catch (error) {
        console.error("Error in financial data processing:", error);
        toast.error("Failed to load financial data");
        throw error;
      }
    }
  });
};
