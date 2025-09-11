import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PinPopup from "@/components/layout/PinPopup";
import HeroBanner from "@/components/home/HeroBanner";
import LoyaltyProgress from "@/components/home/LoyaltyProgress";
import CategoryGrid from "@/components/home/CategoryGrid";
import TodaysPicks from "@/components/home/TodaysPicks";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedPin, setSelectedPin] = useState("");
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [cartCount, setCartCount] = useState(2);
  const { toast } = useToast();

  useEffect(() => {
    const savedPin = localStorage.getItem("ecfresh-pin");
    if (savedPin) {
      setSelectedPin(savedPin);
    } else {
      setShowPinPopup(true);
    }
  }, []);

  const handlePinConfirm = (pin: string) => {
    setSelectedPin(pin);
    setShowPinPopup(false);
    toast({
      title: "Location confirmed!",
      description: `We deliver to ${pin}. Happy shopping! 🛒`,
    });
  };

  const handlePinChange = () => {
    setShowPinPopup(true);
  };

  const handleCategoryClick = (categoryId: string) => {
    toast({
      title: "Category selected",
      description: `Opening ${categoryId} products...`,
    });
  };

  const handleProductClick = (productId: string) => {
    toast({
      title: "Product details",
      description: `Loading product ${productId}...`,
    });
  };

  const handleWishlistToggle = (productId: string) => {
    toast({
      title: "Wishlist updated",
      description: "Product added to wishlist ❤️",
    });
  };

  const handleAddToCart = (productId: string) => {
    setCartCount(prev => prev + 1);
    toast({
      title: "Added to cart!",
      description: "Item successfully added to your cart 🛒",
    });
  };

  if (showPinPopup) {
    return <PinPopup isOpen={showPinPopup} onPinConfirm={handlePinConfirm} />;
  }

  return (
    <div className="min-h-screen bg-background pb-footer">
      <Header selectedPin={selectedPin} onPinChange={handlePinChange} />
      
      <main className="container-fresh space-y-8 py-6">
        {/* Hero Banner */}
        <HeroBanner />
        
        {/* Loyalty Progress */}
        <LoyaltyProgress earnedCredits={450} targetAmount={3000} />
        
        {/* Categories */}
        <CategoryGrid onCategoryClick={handleCategoryClick} />
        
        {/* Today's Picks */}
        <TodaysPicks 
          onProductClick={handleProductClick}
          onWishlistToggle={handleWishlistToggle}
          onAddToCart={handleAddToCart}
        />
      </main>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        cartCount={cartCount}
      />
    </div>
  );
};

export default Index;
