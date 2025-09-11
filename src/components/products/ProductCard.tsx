import { Heart, Plus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp, Product } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist } = useApp();
  const { toast } = useToast();

  const isWishlisted = isInWishlist(product.id);
  const minPrice = Math.min(...product.variants.map(v => v.price));
  const hasDiscount = product.variants.some(v => v.originalPrice && v.originalPrice > v.price);

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? "Item removed from wishlist" : "Item added to wishlist ❤️",
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants.find(v => v.inStock) || product.variants[0];
    addToCart(product.id, defaultVariant.id, 1);
    toast({
      title: "Added to cart!",
      description: `${product.name} added to cart`,
    });
  };

  return (
    <div className="card-fresh overflow-hidden group cursor-pointer" onClick={handleProductClick}>
      {/* Product Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
        >
          <Heart 
            className={`w-4 h-4 ${
              isWishlisted 
                ? "text-red-500 fill-current" 
                : "text-muted-foreground"
            }`} 
          />
        </button>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 bg-brand-orange/90 text-white text-xs"
          >
            Sale
          </Badge>
        )}

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="absolute bottom-2 left-2">
            <Badge 
              variant="secondary" 
              className="bg-primary/90 text-white text-xs"
            >
              {product.tags[0]}
            </Badge>
          </div>
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
        <h3 className="font-medium text-sm mb-1 leading-tight line-clamp-2">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 text-brand-orange fill-current" />
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviews})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-primary">From ₹{minPrice}</span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{Math.min(...product.variants.filter(v => v.originalPrice).map(v => v.originalPrice!))}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className="w-8 h-8 p-0 btn-gradient rounded-full"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}