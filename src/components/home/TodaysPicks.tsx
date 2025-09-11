import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  tag?: string;
  inStock: boolean;
  isWishlisted: boolean;
}

const TODAYS_PICKS: Product[] = [
  {
    id: "1",
    name: "Carrot Julienne Cut",
    image: "/api/placeholder/200/200",
    price: 60,
    originalPrice: 80,
    tag: "Fresh",
    inStock: true,
    isWishlisted: false
  },
  {
    id: "2", 
    name: "Mixed Fruit Salad",
    image: "/api/placeholder/200/200",
    price: 120,
    tag: "Popular",
    inStock: true,
    isWishlisted: true
  },
  {
    id: "3",
    name: "Onion Diced Cut",
    image: "/api/placeholder/200/200", 
    price: 45,
    originalPrice: 55,
    inStock: true,
    isWishlisted: false
  },
  {
    id: "4",
    name: "Cucumber Slices",
    image: "/api/placeholder/200/200",
    price: 35,
    tag: "Quick",
    inStock: false,
    isWishlisted: false
  },
];

interface TodaysPicksProps {
  onProductClick: (productId: string) => void;
  onWishlistToggle: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export default function TodaysPicks({ onProductClick, onWishlistToggle, onAddToCart }: TodaysPicksProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-poppins font-semibold">Today's Picks</h2>
          <p className="text-sm text-muted-foreground">Because you love Fresh Vegetables</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-button">
          View All
        </Button>
      </div>
      
      <div className="grid-products">
        {TODAYS_PICKS.map((product) => (
          <div key={product.id} className="card-fresh overflow-hidden group">
            {/* Product Image */}
            <div className="relative aspect-square bg-muted overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onClick={() => onProductClick(product.id)}
              />
              
              {/* Wishlist Button */}
              <button
                onClick={() => onWishlistToggle(product.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <Heart 
                  className={`w-4 h-4 ${
                    product.isWishlisted 
                      ? "text-red-500 fill-current" 
                      : "text-muted-foreground"
                  }`} 
                />
              </button>
              
              {/* Tag Badge */}
              {product.tag && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 left-2 bg-brand-orange/90 text-white text-xs"
                >
                  {product.tag}
                </Badge>
              )}
              
              {/* Out of Stock Overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">Out of Stock</span>
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="p-3">
              <h3 
                className="font-medium text-sm mb-2 leading-tight cursor-pointer hover:text-primary transition-colors"
                onClick={() => onProductClick(product.id)}
              >
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                
                <Button
                  size="sm"
                  onClick={() => onAddToCart(product.id)}
                  disabled={!product.inStock}
                  className="w-8 h-8 p-0 btn-gradient rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}