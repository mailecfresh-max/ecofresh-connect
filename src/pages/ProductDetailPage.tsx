import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Plus, Minus, Star, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp, PRODUCTS } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist } = useApp();
  const { toast } = useToast();
  
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-poppins font-semibold mb-4">Product not found</h2>
          <Button onClick={() => navigate("/")} className="btn-pill btn-gradient">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariant];
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, currentVariant.id, quantity);
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} (${currentVariant.weight}) added to cart`,
    });
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? "Item removed from wishlist" : "Item added to wishlist ❤️",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-footer">{/* Added pb-footer for universal bottom nav */}
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
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWishlistToggle}
            className="flex items-center gap-2"
          >
            <Heart 
              className={`w-5 h-5 ${isWishlisted ? "text-red-500 fill-current" : ""}`} 
            />
            {isWishlisted ? "Saved" : "Save"}
          </Button>
        </div>
      </header>

      <div className="container-fresh space-y-6 py-6">
        {/* Product Images */}
        <div className="relative">
          <div className="aspect-square bg-muted rounded-card overflow-hidden">
            <img
              src={product.images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    index === activeImageIndex ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-brand-orange/20 text-brand-orange">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-2xl font-poppins font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-brand-orange fill-current" />
              <span className="font-medium">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          {/* Variant Selection */}
          <div>
            <h3 className="font-semibold mb-3">Choose Size</h3>
            <div className="grid grid-cols-1 gap-2">
              {product.variants.map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(index)}
                  disabled={!variant.inStock}
                  className={`card-fresh p-4 text-left transition-all ${
                    selectedVariant === index
                      ? "border-2 border-primary bg-primary/5"
                      : "border border-border hover:border-primary/50"
                  } ${!variant.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{variant.size} - {variant.weight}</div>
                      {!variant.inStock && (
                        <div className="text-sm text-destructive">Out of stock</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">₹{variant.price}</div>
                      {variant.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ₹{variant.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 p-0 rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 p-0 rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="card-fresh p-4 bg-gradient-to-r from-primary/5 to-primary-light/5">
            <div className="flex items-center gap-3 mb-2">
              <Truck className="w-5 h-5 text-primary" />
              <span className="font-medium">Delivery Information</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• Next day delivery available</div>
              <div>• Order before 2 PM for same-day slots</div>
              <div>• Fresh preparation - 20 hour lead time</div>
            </div>
          </div>

          {/* Product Details Accordion */}
          {product.nutritionalInfo && (
            <div className="card-fresh p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Nutritional Information
              </h3>
              <p className="text-sm text-muted-foreground">{product.nutritionalInfo}</p>
            </div>
          )}

          {product.storageInfo && (
            <div className="card-fresh p-4">
              <h3 className="font-semibold mb-2">Storage Tips</h3>
              <p className="text-sm text-muted-foreground">{product.storageInfo}</p>
            </div>
          )}

          {product.recipeIdeas && (
            <div className="card-fresh p-4">
              <h3 className="font-semibold mb-2">Recipe Ideas</h3>
              <div className="flex flex-wrap gap-2">
                {product.recipeIdeas.map(recipe => (
                  <Badge key={recipe} variant="outline">
                    {recipe}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Add to Cart */}
      <div className="fixed bottom-footer left-0 right-0 bg-background border-t p-4 z-40">
        <div className="container-fresh">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold">₹{currentVariant.price * quantity}</div>
              <div className="text-sm text-muted-foreground">
                {quantity}x {currentVariant.weight} • Credits: ₹{Math.floor(currentVariant.price * quantity * 0.1)}
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={!currentVariant.inStock}
            className="w-full h-12 btn-pill btn-gradient font-semibold"
          >
            {currentVariant.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}