
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { PublicSiteConfigProvider } from "@/contexts/PublicSiteConfigContext";
import Dashboard from "./pages/Dashboard";
import InvoiceDetail from "./pages/InvoiceDetail";
import Recipe from "./pages/Recipe";
import Resource from "./pages/Resource";
import NotFound from "./pages/NotFound";
import RFQDetail from "./pages/RFQDetail";
import QuoteDetail from "./pages/QuoteDetail";
import OrderDetail from "./pages/OrderDetail";
import RecipesDashboard from "./pages/RecipesDashboard";
import RecipeCreate from "./pages/RecipeCreate";
import RFQCreate from "./pages/RFQCreate";
import ShipmentsDashboard from "./pages/ShipmentsDashboard";
import UserManagement from "./pages/UserManagement";
import PublicProducts from "./pages/PublicProducts";
import PublicQuote from "./pages/PublicQuote";
import PublicThankYou from "./pages/PublicThankYou";
import PublicSiteConfig from "./pages/PublicSiteConfig";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <PublicSiteConfigProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/public" element={<PublicProducts />} />
              <Route path="/public/quote" element={<PublicQuote />} />
              <Route path="/public/thank-you" element={<PublicThankYou />} />
              
              {/* Admin Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Dashboard />} />
              <Route path="/rfqs" element={<Dashboard />} />
              <Route path="/rfqs/:id" element={<RFQDetail />} />
              <Route path="/rfqs/create" element={<RFQCreate />} />
              <Route path="/quotes" element={<Dashboard />} />
              <Route path="/quotes/:id" element={<QuoteDetail />} />
              <Route path="/orders" element={<Dashboard />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/invoices" element={<Dashboard />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/recipes" element={<RecipesDashboard />} />
              <Route path="/recipes/create" element={<RecipeCreate />} />
              <Route path="/recipes/:id" element={<Recipe />} />
              <Route path="/resources" element={<Resource />} />
              <Route path="/shipments" element={<ShipmentsDashboard />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/public-site-config" element={<PublicSiteConfig />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PublicSiteConfigProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
