import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, User, CreditCard, Truck, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartCount, clearCart } = useApp();
  const { toast } = useToast();

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    additionalPhone: "",
  });

  const [deliveryDate, setDeliveryDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const savedPin = localStorage.getItem("ecfresh-pin") || "";
  const subtotal = cartItems.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const creditsEarned = Math.floor(subtotal * 0.1);
  const total = subtotal + deliveryFee;

  // Generate next 3 days for delivery
  const deliveryOptions = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // Start from tomorrow
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })
    };
  });

  const timeSlots = [
    { value: "morning", label: "10:00 AM - 2:00 PM" },
    { value: "evening", label: "4:00 PM - 8:00 PM" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    // Validate required fields
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address || !customerDetails.landmark) {
      toast({
        title: "Missing details",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!deliveryDate || !timeSlot) {
      toast({
        title: "Select delivery slot",
        description: "Please choose your preferred delivery date and time",
        variant: "destructive",
      });
      return;
    }

    // Simulate order placement
    const orderId = `EC${Date.now().toString().slice(-6)}`;
    
    // Clear cart and navigate to success
    clearCart();
    
    toast({
      title: "Order placed successfully! 🎉",
      description: `Order #${orderId} will be delivered on ${deliveryOptions.find(d => d.value === deliveryDate)?.label}`,
    });

    // Navigate to order confirmation (we'll redirect to home for now)
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleChangePIN = () => {
    localStorage.removeItem("ecfresh-pin");
    navigate("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-poppins font-semibold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate("/")} className="btn-pill btn-gradient">
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
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
          
          <h1 className="font-poppins font-semibold">Checkout</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="container-fresh space-y-6 py-6">
        {/* Delivery PIN */}
        <div className="card-fresh p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Delivery to {savedPin}</div>
                <div className="text-sm text-muted-foreground">Kochi</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleChangePIN}
              className="text-primary"
            >
              Change
            </Button>
          </div>
        </div>

        {/* Customer Details */}
        <div className="card-fresh p-6">
          <h3 className="font-poppins font-semibold text-lg mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={customerDetails.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="h-10 rounded-button"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={customerDetails.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="h-10 rounded-button"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email for order updates"
                value={customerDetails.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="h-10 rounded-button"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Delivery Address *</Label>
              <Input
                id="address"
                placeholder="House/Flat no, Street, Area"
                value={customerDetails.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="h-10 rounded-button"
              />
            </div>
            
            <div>
              <Label htmlFor="landmark">Landmark *</Label>
              <Input
                id="landmark"
                placeholder="Nearby landmark for easy delivery"
                value={customerDetails.landmark}
                onChange={(e) => handleInputChange("landmark", e.target.value)}
                className="h-10 rounded-button"
              />
            </div>
            
            <div>
              <Label htmlFor="additionalPhone">Additional Phone (Optional)</Label>
              <Input
                id="additionalPhone"
                type="tel"
                placeholder="Alternate contact number"
                value={customerDetails.additionalPhone}
                onChange={(e) => handleInputChange("additionalPhone", e.target.value)}
                className="h-10 rounded-button"
              />
            </div>
          </div>
        </div>

        {/* Delivery Schedule */}
        <div className="card-fresh p-6">
          <h3 className="font-poppins font-semibold text-lg mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Delivery Schedule
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label>Select Delivery Date</Label>
              <Select value={deliveryDate} onValueChange={setDeliveryDate}>
                <SelectTrigger className="h-10 rounded-button">
                  <SelectValue placeholder="Choose delivery date" />
                </SelectTrigger>
                <SelectContent>
                  {deliveryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Select Time Slot</Label>
              <RadioGroup value={timeSlot} onValueChange={setTimeSlot}>
                {timeSlots.map(slot => (
                  <div key={slot.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={slot.value} id={slot.value} />
                    <Label htmlFor={slot.value}>{slot.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>Note:</strong> Orders require 20 hours preparation time. 
              Orders placed after 2 PM won't be available for next day morning slots.
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="card-fresh p-6">
          <h3 className="font-poppins font-semibold text-lg mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </h3>
          
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod">Cash on Delivery (COD)</Label>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <RadioGroupItem value="upi" id="upi" disabled />
              <Label htmlFor="upi">UPI Payment (Coming Soon)</Label>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <RadioGroupItem value="card" id="card" disabled />
              <Label htmlFor="card">Credit/Debit Card (Coming Soon)</Label>
            </div>
          </RadioGroup>
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
            
            <div className="flex justify-between text-sm text-success">
              <span className="flex items-center gap-1">
                <Gift className="w-4 h-4" />
                Credits Earned (10%)
              </span>
              <span>₹{creditsEarned}</span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-40">
        <div className="container-fresh">
          <Button
            onClick={handlePlaceOrder}
            className="w-full h-12 btn-pill btn-gradient font-semibold"
          >
            Place Order • ₹{total}
          </Button>
        </div>
      </div>
    </div>
  );
}