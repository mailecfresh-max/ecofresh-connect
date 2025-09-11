import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import BottomNav from "@/components/layout/BottomNav";
import Index from "./pages/Index";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./pages/NotFound";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

// Component that handles the bottom navigation logic
function AppWithNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useApp();
  const { toast } = useToast();

  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/product') || path.startsWith('/category')) return 'shop';
    if (path === '/cart') return 'cart';
    if (path === '/wishlist') return 'wishlist';
    if (path === '/account') return 'account';
    return 'home';
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case "home":
        navigate("/");
        break;
      case "cart":
        navigate("/cart");
        break;
      case "wishlist":
        navigate("/wishlist");
        break;
      case "shop":
        // Navigate to first category for now
        navigate("/category/fresh-vegetables");
        break;
      case "account":
        navigate("/account");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Universal Bottom Navigation - Hide on checkout */}
      {location.pathname !== '/checkout' && (
        <BottomNav 
          activeTab={getActiveTab()} 
          onTabChange={handleTabChange}
          cartCount={cartCount}
        />
      )}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppWithNavigation />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
