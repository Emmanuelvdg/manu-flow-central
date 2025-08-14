
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, ShoppingCart, Users, Settings, FileText, TrendingUp, Wrench, LogIn, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Dashboard",
      description: "Overview of your business metrics and KPIs",
      path: "/dashboard"
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Products",
      description: "Manage your product catalog and inventory",
      path: "/products"
    },
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "Orders",
      description: "Track and manage customer orders",
      path: "/orders"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Quotes",
      description: "Create and manage customer quotes",
      path: "/quotes"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Reporting",
      description: "Analytics and business intelligence",
      path: "/reporting"
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "FX Management",
      description: "Manage currencies and exchange rates",
      path: "/fx-management"
    },
    {
      icon: <LogIn className="h-8 w-8" />,
      title: "Authentication",
      description: "Sign in to manage your settings",
      path: "/auth"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Business Management System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solution for managing your business operations, from products to finances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {feature.description}
                </CardDescription>
                <Button 
                  onClick={() => navigate(feature.path)}
                  className="w-full"
                  variant="outline"
                >
                  Access {feature.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in to access the FX Management system and configure your currency settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="mr-4"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/fx-management')}
                size="lg"
                variant="outline"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                FX Management
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
