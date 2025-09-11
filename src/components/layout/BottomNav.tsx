import { Home, Store, Heart, ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount?: number;
}

export default function BottomNav({ activeTab, onTabChange, cartCount = 0 }: BottomNavProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "shop", label: "Shop", icon: Store },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
    { id: "account", label: "Account", icon: User },
  ];

  return (
    <nav className="sticky-footer h-footer bg-background/95 backdrop-blur-sm">
      <div className="h-full flex items-center justify-around px-4">
        {navItems.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 relative transition-colors ${
              activeTab === id 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-1" />
              {badge && badge > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
                >
                  {badge > 99 ? "99+" : badge}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium truncate">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}