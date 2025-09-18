import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TripGenie from "./pages/TripGenie";
import Heritage from "./pages/Heritage";
import Community from "./pages/Community";
import Bookings from "./pages/Bookings";
import Emergency from "./pages/Emergency";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import Dashboard from "./pages/Dashboard";
import VRExperiencePage from "./pages/VRExperience";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/trip-genie" element={<TripGenie />} />
            <Route path="/heritage" element={<Heritage />} />
            <Route path="/community" element={<Community />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ar-vr-experience" element={<VRExperiencePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
