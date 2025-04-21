
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock products data
const mockProducts = [
  { id: 1, name: 'Industrial Pump XL-5000', category: 'Machinery', price: 4200, leadTime: '4 weeks', image: 'https://via.placeholder.com/150x100?text=Pump' },
  { id: 2, name: 'Electric Motor M-Series', category: 'Electrical', price: 1250, leadTime: '2 weeks', image: 'https://via.placeholder.com/150x100?text=Motor' },
  { id: 3, name: 'Control Panel CP-2000', category: 'Electronics', price: 3800, leadTime: '3 weeks', image: 'https://via.placeholder.com/150x100?text=Panel' },
  { id: 4, name: 'Hydraulic System HS-500', category: 'Machinery', price: 6500, leadTime: '6 weeks', image: 'https://via.placeholder.com/150x100?text=Hydraulic' },
  { id: 5, name: 'Conveyor Belt 30m', category: 'Machinery', price: 2800, leadTime: '4 weeks', image: 'https://via.placeholder.com/150x100?text=Conveyor' },
  { id: 6, name: 'Industrial Fan IF-1200', category: 'HVAC', price: 950, leadTime: '2 weeks', image: 'https://via.placeholder.com/150x100?text=Fan' },
  { id: 7, name: 'Pressure Sensor PS-100', category: 'Electronics', price: 420, leadTime: '1 week', image: 'https://via.placeholder.com/150x100?text=Sensor' },
  { id: 8, name: 'Robotic Arm RA-3000', category: 'Automation', price: 12500, leadTime: '8 weeks', image: 'https://via.placeholder.com/150x100?text=Robot' },
];

export const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<typeof mockProducts>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const { toast } = useToast();

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(mockProducts.map(p => p.category)));

  const addToCart = (product: typeof mockProducts[0]) => {
    if (!cartItems.some(item => item.id === product.id)) {
      setCartItems([...cartItems, product]);
      toast({
        title: "Added to RFQ",
        description: `${product.name} has been added to your quote request.`,
      });
    } else {
      toast({
        title: "Already in RFQ",
        description: `${product.name} is already in your quote request.`,
        variant: "destructive",
      });
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Removed from RFQ",
      description: "Item has been removed from your quote request.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button 
            variant={filterCategory === '' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory('')}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={filterCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-48 bg-gray-200">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">{product.category}</Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">${product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">Lead time: {product.leadTime}</span>
                </div>
                <Button 
                  onClick={() => addToCart(product)} 
                  className="w-full"
                  variant="default"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to RFQ
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 border">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Your RFQ Items ({cartItems.length})</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCartItems([])}
            >
              Clear All
            </Button>
          </div>
          
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">${item.price.toLocaleString()}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <span className="font-semibold">Total Items:</span>
            <span className="font-semibold">{cartItems.length}</span>
          </div>
          
          <Button 
            className="w-full"
            size="lg"
            onClick={() => {
              toast({
                title: "RFQ Created",
                description: `Quote request with ${cartItems.length} items has been submitted.`,
              });
              setCartItems([]);
            }}
          >
            Submit RFQ
          </Button>
        </div>
      )}
    </div>
  );
};
