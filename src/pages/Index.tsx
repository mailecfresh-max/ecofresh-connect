import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PinPopup from "@/components/layout/PinPopup";
import HeroBanner from "@/components/home/HeroBanner";
import LoyaltyProgress from "@/components/home/LoyaltyProgress";
import CategoryGrid from "@/components/home/CategoryGrid";
import TodaysPicks from "@/components/home/TodaysPicks";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [selectedPin, setSelectedPin] = useState("");
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const { cartCount } = useApp();
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
    navigate(`/category/${categoryId}`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
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
        toast({
          title: "Account",
          description: "Account page coming soon!",
        });
        break;
    }
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
          onWishlistToggle={() => {}}
          onAddToCart={() => {}}
        />
      </main>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        cartCount={cartCount}
      />
    </div>
  );
};

export default Index;
