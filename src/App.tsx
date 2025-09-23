import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { FontSizeProvider } from "@/components/FontSizeProvider";
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
import Transport from "./pages/Transport";
import NotFound from "./pages/NotFound";
import sosIcon from "@/assets/sos.png";

import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FontSizeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout />
          </BrowserRouter>
        </TooltipProvider>
      </FontSizeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

const MainLayout = () => {
  const location = useLocation();
  const showSOSButton = location.pathname !== "/emergency";

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/trip-genie" element={<TripGenie />} />
        <Route path="/heritage" element={<Heritage />} />
        <Route path="/community" element={<Community />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route element={<AdminRoute />}>
          <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/ar-vr-experience" element={<VRExperiencePage />} />
        <Route path="/transport" element={<Transport />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showSOSButton && (
        <Link
          to="/emergency"
          className="fixed bottom-8 right-8 z-50 transition-opacity hover:opacity-80"
        >
          <img src={sosIcon} alt="SOS" className="w-16 h-16 rounded-full shadow-lg" />
        </Link>
      )}
    </>
  );
};

export default App;
