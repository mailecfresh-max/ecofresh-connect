import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, removeFromCart, cartCount } = useApp();
  const { toast } = useToast();

  const subtotal = cartItems.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const creditsEarned = Math.floor(subtotal * 0.1);
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (productId: string, variantId: string, newQuantity: number) => {
    updateCartQuantity(productId, variantId, newQuantity);
  };

  const handleRemoveItem = (productId: string, variantId: string, productName: string) => {
    removeFromCart(productId, variantId);
    toast({
      title: "Item removed",
      description: `${productName} removed from cart`,
    });
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
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
            
            <h1 className="font-poppins font-semibold">Cart</h1>
            <div className="w-16" />
          </div>
        </header>

        {/* Empty Cart */}
        <div className="container-fresh flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-poppins font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Looks like you haven't added any items to your cart yet
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="btn-pill btn-gradient"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

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
          
          <h1 className="font-poppins font-semibold">Cart ({cartCount})</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="container-fresh space-y-6 py-6">
        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="card-fresh p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div 
                  className="w-20 h-20 bg-muted rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(item.productId)}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 
                    className="font-medium text-sm mb-1 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleProductClick(item.productId)}
                  >
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Size: {item.variant.weight}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity - 1)}
                        className="w-8 h-8 p-0 rounded-full"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      
                      <span className="font-medium w-6 text-center">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity + 1)}
                        className="w-8 h-8 p-0 rounded-full"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-primary">₹{item.variant.price * item.quantity}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.productId, item.variantId, item.product.name)}
                        className="text-destructive hover:text-destructive h-auto p-0 text-xs"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card-fresh p-6">
          <h3 className="font-poppins font-semibold text-lg mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({cartCount} items)</span>
              <span>₹{subtotal}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span className={deliveryFee === 0 ? "text-success" : ""}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            
            {subtotal < 500 && (
              <div className="text-xs text-muted-foreground">
                Add ₹{500 - subtotal} more for free delivery
              </div>
            )}
            
            <div className="flex justify-between text-sm text-success">
              <span>Credits Earned (10%)</span>
              <span>₹{creditsEarned}</span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-40">
        <div className="container-fresh">
          <Button
            onClick={handleCheckout}
            className="w-full h-12 btn-pill btn-gradient font-semibold flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Proceed to Checkout • ₹{total}
          </Button>
        </div>
      </div>
    </div>
  );
}