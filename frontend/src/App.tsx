import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppLayout } from "@/components/AppLayout";
import InstallPrompt from "@/components/InstallPrompt";

// Landing pages (Smart Karni)
import LandingPage from "./pages/landing/LandingPage";
import Features from "./pages/landing/Features";
import Pricing from "./pages/landing/Pricing";
import Contact from "./pages/landing/Contact";
import Privacy from "./pages/landing/Privacy";
import Preview from "./pages/landing/Preview";

// Credit Manager pages
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" dir="rtl" />
          <InstallPrompt />
          <BrowserRouter>
            <Routes>
              {/* Landing pages (Smart Karni) */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/preview" element={<Preview />} />

              {/* Credit Manager */}
              <Route path="/auth" element={<Auth />} />

              {/* Redirect old /app URLs */}
              <Route path="/app" element={<Navigate to="/auth" replace />} />
              <Route path="/app/*" element={<Navigate to="/auth" replace />} />

              {/* Protected Routes */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:id" element={<ClientDetail />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
