
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

export const CreateInvoiceForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [formData, setFormData] = useState({
    orderId: '',
    dueDate: '',
    notes: ''
  });

  // Fetch orders that don't have invoices yet
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        
        // Fetch orders without invoices or with draft invoices only
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id, 
            order_number, 
            customer_name, 
            total
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Set the orders data
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load orders',
          variant: 'destructive',
        });
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderId) {
      toast({
        title: 'Missing Information',
        description: 'Please select an order',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      // Get the selected order details
      const selectedOrder = orders.find(order => order.id === formData.orderId);
      if (!selectedOrder) throw new Error('Order not found');

      // Generate invoice number (e.g., INV-YYYY-XXXX)
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Calculate due date (defaults to 30 days from now if not specified)
      let dueDate = new Date();
      if (formData.dueDate) {
        dueDate = new Date(formData.dueDate);
      } else {
        dueDate.setDate(dueDate.getDate() + 30);
      }

      // Create the invoice record
      const { data: invoice, error } = await supabase
        .from('invoices')
        .insert({
          order_id: formData.orderId,
          amount: selectedOrder.total,
          invoice_number: invoiceNumber,
          due_date: dueDate.toISOString(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Invoice Created',
        description: `Invoice #${invoiceNumber} has been created successfully.`,
      });

      // Navigate to the newly created invoice
      navigate(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to create invoice',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Select Order</Label>
              {loadingOrders ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading orders...</span>
                </div>
              ) : (
                <Select 
                  onValueChange={(value) => handleSelectChange('orderId', value)}
                  value={formData.orderId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.length === 0 ? (
                      <SelectItem value="no-orders" disabled>No orders available</SelectItem>
                    ) : (
                      orders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.order_number} - {order.customer_name} (${order.total})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500">If not set, due date will be 30 days from today.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional invoice notes"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/invoices')}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading || loadingOrders}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Invoice...
            </>
          ) : (
            'Create Invoice'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
