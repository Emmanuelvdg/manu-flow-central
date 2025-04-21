
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import InvoiceDetail from "./pages/InvoiceDetail";
import Recipe from "./pages/Recipe";
import Resource from "./pages/Resource";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Dashboard />} />
          <Route path="/rfqs" element={<Dashboard />} />
          <Route path="/quotes" element={<Dashboard />} />
          <Route path="/orders" element={<Dashboard />} />
          <Route path="/invoices" element={<Dashboard />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/recipes" element={<Dashboard />} />
          <Route path="/recipes/:id" element={<Recipe />} />
          <Route path="/resources" element={<Resource />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
