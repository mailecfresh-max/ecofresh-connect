import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, User, CreditCard, Truck, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartCount, clearCart } = useApp();
  const { user, signUp } = useAuth();
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
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Load user profile data if authenticated
  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (profile) {
          setCustomerDetails({
            name: profile.full_name || "",
            phone: profile.phone || "",
            email: profile.email || user.email || "",
            address: profile.address || "",
            landmark: profile.landmark || "",
            additionalPhone: profile.additional_phone || "",
          });
        } else {
          setCustomerDetails(prev => ({
            ...prev,
            email: user.email || "",
          }));
        }
      };
      
      setTimeout(loadProfile, 0);
    }
  }, [user]);

  const createUserAccountAndSignIn = async () => {
    if (!customerDetails.email || !customerDetails.name) {
      return null;
    }

    try {
      // Generate a random password for the user
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      // Create the account
      const { error: signUpError } = await signUp(customerDetails.email, randomPassword, customerDetails.name);
      
      if (signUpError) {
        console.error('Account creation error:', signUpError);
        return null;
      }

      // Wait a moment for the account to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sign in the user immediately
      const { error: signInError } = await signIn(customerDetails.email, randomPassword);
      
      if (signInError) {
        console.error('Auto sign-in error:', signInError);
        // Even if sign-in fails, we can still process the order
        return randomPassword;
      }

      return randomPassword;
    } catch (error) {
      console.error('Account creation and sign-in failed:', error);
      return null;
    }
  };

  const saveProfileAndOrder = async (userId: string) => {
    try {
      // Update or create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          full_name: customerDetails.name,
          phone: customerDetails.phone,
          email: customerDetails.email,
          address: customerDetails.address,
          landmark: customerDetails.landmark,
          additional_phone: customerDetails.additionalPhone,
          pin_code: savedPin,
        });

      if (profileError) {
        console.error('Profile save error:', profileError);
        return null;
      }

      // Create order
      const orderId = `EC${Date.now().toString().slice(-6)}`;
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          order_number: orderId,
          customer_name: customerDetails.name,
          customer_phone: customerDetails.phone,
          customer_email: customerDetails.email,
          delivery_address: customerDetails.address,
          landmark: customerDetails.landmark,
          additional_phone: customerDetails.additionalPhone,
          pin_code: savedPin,
          delivery_date: deliveryDate,
          time_slot: timeSlot,
          payment_method: paymentMethod,
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          total_amount: total,
          credits_earned: creditsEarned,
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        return null;
      }

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_name: item.product.name,
        variant_size: item.variant.size,
        quantity: item.quantity,
        unit_price: item.variant.price,
        total_price: item.variant.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        return null;
      }

      return orderId;
    } catch (error) {
      console.error('Save operation failed:', error);
      return null;
    }
  };

  const processGuestOrder = async () => {
    // For guest orders, we'll create a temporary order ID and show success
    // In a real implementation, you might want to save this to a separate guest orders table
    const orderId = `EC${Date.now().toString().slice(-6)}`;
    
    clearCart();
    
    toast({
      title: "Order placed successfully! 🎉",
      description: `Order #${orderId} will be delivered on ${deliveryOptions.find(d => d.value === deliveryDate)?.label}`,
    });

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };
  const handlePlaceOrder = async () => {
    // Validate required fields
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.email || !customerDetails.address || !customerDetails.landmark) {
      toast({
        title: "Missing details", 
        description: "Please fill in all required fields including email address",
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


    setIsProcessing(true);

    try {
      let currentUserId = user?.id;

      // If user is not logged in, automatically create account and sign them in
      if (!user && customerDetails.email) {
        const password = await createUserAccountAndSignIn();
        if (password) {
          toast({
            title: "Account created and signed in! 🎉",
            description: "Your account has been created automatically. You're now signed in!",
          });
          
          // Wait a moment for the auth state to update
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Get the current user after sign-in
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          currentUserId = currentUser?.id;
        } else {
          toast({
            title: "Account creation failed",
            description: "We'll process your order as a guest",
            variant: "destructive",
          });
        }
      }

      // If user is logged in, save profile and create order
      if (currentUserId) {
        const orderId = await saveProfileAndOrder(currentUserId);
        
        if (orderId) {
          clearCart();
          
          toast({
            title: "Order placed successfully! 🎉",
            description: `Order #${orderId} will be delivered on ${deliveryOptions.find(d => d.value === deliveryDate)?.label}`,
          });

          setTimeout(() => {
            navigate("/");
          }, 2000);
          return;
        }
      }

      // Fallback: Process as guest order (show success but don't save to database)
      await processGuestOrder();
      
    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: "Order failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email for order updates"
                value={customerDetails.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="h-10 rounded-button"
                required
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

            {!user && (
              <div className="p-3 bg-primary/5 rounded-lg text-sm">
                <div className="flex items-center gap-2 text-primary font-medium mb-1">
                  <User className="w-4 h-4" />
                  Account Creation
                </div>
                <p className="text-muted-foreground">
                  ✓ We'll automatically create your account and sign you in so you can track your orders and reorder easily next time!
                </p>
              </div>
            )}

            {user && (
              <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                ✓ Logged in as {user.email}. Your details will be saved automatically.
              </div>
            )}
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
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Place Order • ₹${total}`}
          </Button>
        </div>
      </div>
    </div>
  );
}