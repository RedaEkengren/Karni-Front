import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Landing pages
import Index from "./pages/Index.tsx";
import Features from "./pages/Features.tsx";
import Pricing from "./pages/Pricing.tsx";
import Contact from "./pages/Contact.tsx";
import Privacy from "./pages/Privacy.tsx";
import Preview from "./pages/Preview.tsx";
import NotFound from "./pages/NotFound.tsx";

// Auth pages
import Login from "./pages/auth/Login.tsx";
import VerifyOTP from "./pages/auth/VerifyOTP.tsx";

// App pages
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AppLayout from "./pages/app/AppLayout.tsx";
import Dashboard from "./pages/app/Dashboard.tsx";
import Customers from "./pages/app/Customers.tsx";
import CustomerDetail from "./pages/app/CustomerDetail.tsx";
import AddCustomer from "./pages/app/AddCustomer.tsx";
import Sadaqa from "./pages/app/Sadaqa.tsx";
import Chat from "./pages/app/Chat.tsx";
import Settings from "./pages/app/Settings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing pages */}
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/preview" element={<Preview />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<VerifyOTP />} />

            {/* App (protected) */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/add" element={<AddCustomer />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="sadaqa" element={<Sadaqa />} />
              <Route path="chat" element={<Chat />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
