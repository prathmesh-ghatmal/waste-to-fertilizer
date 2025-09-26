import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Role-based dashboard pages
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorWasteListings from "./pages/donor/DonorWasteListings";
import DonorProfile from "./pages/donor/DonorProfile";

import ManufacturerDashboard from "./pages/manufacturer/ManufacturerDashboard";
import ManufacturerCollection from "./pages/manufacturer/ManufacturerCollection";
import ManufacturerProcessing from "./pages/manufacturer/ManufacturerProcessing";
import ManufacturerInventory from "./pages/manufacturer/ManufacturerInventory";
import ManufacturerProfile from "./pages/manufacturer/ManufacturerProfile";

import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerMarketplace from "./pages/buyer/BuyerMarketplace";
import BuyerCart from "./pages/buyer/BuyerCart";
import BuyerOrders from "./pages/buyer/BuyerOrders";
import BuyerProfile from "./pages/buyer/BuyerProfile";

// Shared pages
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import About from "./pages/About";

import { UserRole } from "@/lib/data";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Default redirect to landing */}
            <Route path="/" element={<Index />} />
            
            {/* Public routes - redirect to dashboard if authenticated */}
            <Route path="/landing" element={
              <ProtectedRoute requireAuth={false}>
                <Landing />
              </ProtectedRoute>
            } />
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={
              <ProtectedRoute requireAuth={false}>
                <Signup />
              </ProtectedRoute>
            } />

            {/* Donor Routes */}
            <Route path="/donor/dashboard" element={
              <ProtectedRoute allowedRoles={[UserRole.DONOR]}>
                <DonorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/donor/waste-listings" element={
              <ProtectedRoute allowedRoles={[UserRole.DONOR]}>
                <DonorWasteListings />
              </ProtectedRoute>
            } />
            <Route path="/donor/profile" element={
              <ProtectedRoute allowedRoles={[UserRole.DONOR]}>
                <DonorProfile />
              </ProtectedRoute>
            } />

            {/* Manufacturer Routes */}
            <Route path="/manufacturer/dashboard" element={
              <ProtectedRoute allowedRoles={[UserRole.MANUFACTURER]}>
                <ManufacturerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/manufacturer/food-collection" element={
              <ProtectedRoute allowedRoles={[UserRole.MANUFACTURER]}>
                <ManufacturerCollection />
              </ProtectedRoute>
            } />
            <Route path="/manufacturer/fertilizer-processing" element={
              <ProtectedRoute allowedRoles={[UserRole.MANUFACTURER]}>
                <ManufacturerProcessing />
              </ProtectedRoute>
            } />
            <Route path="/manufacturer/inventory" element={
              <ProtectedRoute allowedRoles={[UserRole.MANUFACTURER]}>
                <ManufacturerInventory />
              </ProtectedRoute>
            } />
            <Route path="/manufacturer/profile" element={
              <ProtectedRoute allowedRoles={[UserRole.MANUFACTURER]}>
                <ManufacturerProfile />
              </ProtectedRoute>
            } />

            {/* Buyer Routes */}
            <Route path="/buyer/dashboard" element={
              <ProtectedRoute allowedRoles={[UserRole.BUYER]}>
                <BuyerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/buyer/marketplace" element={
              <ProtectedRoute allowedRoles={[UserRole.BUYER]}>
                <BuyerMarketplace />
              </ProtectedRoute>
            } />
            <Route path="/buyer/cart" element={
              <ProtectedRoute allowedRoles={[UserRole.BUYER]}>
                <BuyerCart />
              </ProtectedRoute>
            } />
            <Route path="/buyer/orders" element={
              <ProtectedRoute allowedRoles={[UserRole.BUYER]}>
                <BuyerOrders />
              </ProtectedRoute>
            } />
            <Route path="/buyer/profile" element={
              <ProtectedRoute allowedRoles={[UserRole.BUYER]}>
                <BuyerProfile />
              </ProtectedRoute>
            } />

            {/* Shared Routes */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute requireAuth={false}>
                <Help />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute requireAuth={false}>
                <About />
              </ProtectedRoute>
            } />

            {/* 404 - Must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
