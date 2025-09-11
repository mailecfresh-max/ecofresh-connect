import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp, PRODUCTS } from "@/contexts/AppContext";
import ProductCard from "@/components/products/ProductCard";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlistItems } = useApp();

  const wishlistProducts = PRODUCTS.filter(product => 
    wishlistItems.includes(product.id)
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky-header h-header">
        <div className="container-fresh h-full flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <h1 className="font-poppins font-semibold">Wishlist</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="container-fresh py-6">
        {wishlistProducts.length === 0 ? (
          /* Empty Wishlist */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-poppins font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 text-center">
              Save items you love to your wishlist
            </p>
            <Button 
              onClick={() => navigate("/")}
              className="btn-pill btn-gradient flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-xl font-poppins font-semibold mb-1">
                Your Saved Items
              </h2>
              <p className="text-muted-foreground">
                {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid-products">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}