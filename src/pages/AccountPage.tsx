import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, ShoppingBag, MapPin, Settings, Heart, LogOut, 
  ArrowLeft, Package 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function AccountPage() {
  const navigate = useNavigate();
  const { cartCount } = useApp();
  const { user, signOut, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Load user data
  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        // Load profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setProfile(profileData);

        // Load orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        setOrders(ordersData || []);
      };

      setTimeout(loadUserData, 0);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
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
          
          <div className="flex-1">
            <h1 className="font-poppins font-semibold">Account</h1>
          </div>
          
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-primary"
            >
              Sign Out
            </Button>
          )}
        </div>
      </header>
      
      <div className="container-fresh py-6 space-y-6">
        {!user ? (
          // Guest user - show login/signup options
          <div className="text-center py-12">
            <div className="card-fresh p-8 max-w-md mx-auto">
              <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-poppins font-semibold mb-2">Sign in to your account</h2>
              <p className="text-muted-foreground mb-6">
                Access your orders, saved addresses, and preferences
              </p>
              
              <div className="space-y-3">
                <Link to="/auth">
                  <Button className="w-full btn-pill btn-gradient">
                    Sign In / Sign Up
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Authenticated user - show account details
          <>
            {/* User Info Card */}
            <div className="card-fresh p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-poppins font-semibold">
                    {profile?.full_name || 'Welcome!'}
                  </h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  {profile?.phone && (
                    <p className="text-sm text-muted-foreground">{profile.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card-fresh">
              <div className="flex border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-poppins font-semibold">Profile Information</h3>
                    {profile ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Full Name</Label>
                            <p className="mt-1 text-foreground">{profile.full_name}</p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p className="mt-1 text-foreground">{profile.email}</p>
                          </div>
                          <div>
                            <Label>Phone</Label>
                            <p className="mt-1 text-foreground">{profile.phone}</p>
                          </div>
                          <div>
                            <Label>PIN Code</Label>
                            <p className="mt-1 text-foreground">{profile.pin_code}</p>
                          </div>
                        </div>
                        {profile.address && (
                          <div>
                            <Label>Address</Label>
                            <p className="mt-1 text-foreground">{profile.address}</p>
                            {profile.landmark && (
                              <p className="text-sm text-muted-foreground">Landmark: {profile.landmark}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Profile information will appear after your first order.</p>
                    )}
                  </div>
                )}

                {activeTab === "orders" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-poppins font-semibold">Order History</h3>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium">Order #{order.order_number}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">₹{order.total_amount}</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-sm text-muted-foreground mb-2">
                              <p>Delivery: {order.delivery_date} ({order.time_slot})</p>
                              <p>Items: {order.order_items?.length || 0}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground mb-4">No orders yet</p>
                        <Button onClick={() => navigate("/")} className="btn-pill btn-gradient">
                          Start Shopping
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "addresses" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-poppins font-semibold">Saved Addresses</h3>
                    {profile?.address ? (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Primary Address
                            </h4>
                            <p className="mt-1 text-foreground">{profile.address}</p>
                            {profile.landmark && (
                              <p className="text-sm text-muted-foreground">Landmark: {profile.landmark}</p>
                            )}
                            <p className="text-sm text-muted-foreground">PIN: {profile.pin_code}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground mb-4">No saved addresses</p>
                        <Button onClick={() => navigate("/checkout")} variant="outline">
                          Add Address During Checkout
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-poppins font-semibold">Account Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">Get updates about your orders</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="email-notifications" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">SMS Notifications</h4>
                          <p className="text-sm text-muted-foreground">Get delivery updates via SMS</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="sms-notifications" />
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Button 
                          variant="outline" 
                          onClick={handleSignOut}
                          className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}