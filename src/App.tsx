
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import Resource from "@/pages/Resource";
import OrderDetail from "@/pages/OrderDetail";
import Orders from "@/pages/Orders"; // Added import for Orders page
import QuoteDetail from "@/pages/QuoteDetail";
import PublicSiteConfig from "@/pages/PublicSiteConfig";
import RFQDetail from "@/pages/RFQDetail";
import RFQCreate from "@/pages/RFQCreate";
import UserManagement from "@/pages/UserManagement";
import InvoiceDetail from "@/pages/InvoiceDetail";
import Recipe from "@/pages/Recipe";
import RecipeCreate from "@/pages/RecipeCreate";
import RecipesDashboard from "@/pages/RecipesDashboard";
import ShipmentsDashboard from "@/pages/ShipmentsDashboard";
import ReportingDashboard from "@/pages/ReportingDashboard";
import Quotes from "@/pages/Quotes";
import RFQs from "@/pages/RFQs";
import Invoices from "@/pages/Invoices";
import Products from "@/pages/Products";
import PublicProducts from "@/pages/PublicProducts";
import QuoteOrderMappingPage from "@/pages/order-detail/QuoteOrderMappingPage"; // Add this import

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resources" element={<Resource />} />
          <Route path="/orders" element={<Orders />} /> 
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/orders/quote-order-mapping" element={<QuoteOrderMappingPage />} /> {/* Updated to use dedicated component */}
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/quotes/:id" element={<QuoteDetail />} />
          <Route path="/rfqs" element={<RFQs />} />
          <Route path="/rfqs/:id" element={<RFQDetail />} />
          <Route path="/rfqs/create" element={<RFQCreate />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/site-config" element={<PublicSiteConfig />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/recipe/:id" element={<Recipe />} />
          <Route path="/recipe/create" element={<RecipeCreate />} />
          <Route path="/recipes" element={<RecipesDashboard />} />
          <Route path="/shipments" element={<ShipmentsDashboard />} />
          <Route path="/reporting" element={<ReportingDashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
