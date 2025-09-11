import { PRODUCTS } from "@/contexts/AppContext";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

interface TodaysPicksProps {
  onProductClick: (productId: string) => void;
  onWishlistToggle: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export default function TodaysPicks({ onProductClick, onWishlistToggle, onAddToCart }: TodaysPicksProps) {
  // Show first 6 products as today's picks
  const todaysPicks = PRODUCTS.slice(0, 6);
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
        {todaysPicks.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}