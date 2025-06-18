
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Quotes from "./pages/Quotes";
import QuoteDetail from "./pages/QuoteDetail";
import RFQs from "./pages/RFQs";
import RFQDetail from "./pages/RFQDetail";
import RFQCreate from "./pages/RFQCreate";
import Resource from "./pages/Resource";
import Recipe from "./pages/Recipe";
import RecipeCreate from "./pages/RecipeCreate";
import RecipesDashboard from "./pages/RecipesDashboard";
import ShipmentsDashboard from "./pages/ShipmentsDashboard";
import ReportingDashboard from "./pages/ReportingDashboard";
import Invoices from "./pages/Invoices";
import InvoiceDetail from "./pages/InvoiceDetail";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import PublicSiteConfig from "./pages/PublicSiteConfig";

// Public pages
import PublicProducts from "./pages/PublicProducts";
import PublicQuote from "./pages/PublicQuote";
import PublicThankYou from "./pages/PublicThankYou";

// Providers
import { PublicSiteConfigProvider } from "./contexts/PublicSiteConfigContext";

// Styles
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicSiteConfigProvider>
        <Router>
          <Routes>
            {/* Auth & Dashboard Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/:id" element={<QuoteDetail />} />
            <Route path="/rfqs" element={<RFQs />} />
            <Route path="/rfqs/:id" element={<RFQDetail />} />
            <Route path="/rfqs/create" element={<RFQCreate />} />
            <Route path="/resources" element={<Resource />} />
            <Route path="/recipes" element={<RecipesDashboard />} />
            <Route path="/recipes/create" element={<RecipeCreate />} />
            <Route path="/recipes/:id" element={<Recipe />} />
            <Route path="/shipments" element={<ShipmentsDashboard />} />
            <Route path="/reporting" element={<ReportingDashboard />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/public-site-config" element={<PublicSiteConfig />} />
            
            {/* Public Routes */}
            <Route path="/public" element={<PublicProducts />} />
            <Route path="/public/quote" element={<PublicQuote />} />
            <Route path="/public/thank-you" element={<PublicThankYou />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </PublicSiteConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
