
import React from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data matching our recipes data structure
const mockOrderDetails = {
  "MO00199": {
    number: "MO00199",
    customerName: "ABC Manufacturing",
    products: [
      {
        id: "PFP_5L",
        name: "Packaged Food Product, 5L Canister",
        quantity: 10,
        group: "Food: Finished goods",
        progress: {
          materials: 60,
          personnel: 80,
          machines: 40
        }
      }
    ],
    shippingAddress: "123 Industrial Park, Business District",
    status: "Processing"
  }
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orderDetails = mockOrderDetails[id as keyof typeof mockOrderDetails];

  return (
    <MainLayout title={`Order Detail - ${id}`}>
      <div className="max-w-4xl mx-auto mt-8">
        <Button variant="outline" size="sm" asChild>
          <Link to="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
        
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Order #{id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <input 
                    type="text" 
                    className="w-full rounded border p-2" 
                    value={orderDetails?.customerName} 
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="w-full rounded border p-2" value={orderDetails?.status}>
                    <option>Submitted</option>
                    <option>Processing</option>
                    <option>Completed</option>
                    <option>Fulfilled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Shipping Address</label>
                <input 
                  type="text" 
                  className="w-full rounded border p-2" 
                  value={orderDetails?.shippingAddress} 
                  readOnly
                />
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Products & Progress</h3>
                {orderDetails?.products.map((product, idx) => (
                  <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {product.quantity} | Group: {product.group}
                        </p>
                      </div>
                      <Link 
                        to={`/recipes/${product.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Recipe
                      </Link>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Materials</span>
                          <span>{product.progress.materials}%</span>
                        </div>
                        <Progress value={product.progress.materials} />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Personnel</span>
                          <span>{product.progress.personnel}%</span>
                        </div>
                        <Progress value={product.progress.personnel} />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Machines</span>
                          <span>{product.progress.machines}%</span>
                        </div>
                        <Progress value={product.progress.machines} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto">Save Order</Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default OrderDetail;
