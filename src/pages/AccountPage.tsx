import { useState } from "react";
import { Edit2, CheckCircle, Package, MapPin, Settings, Heart, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useApp } from "@/contexts/AppContext";
import { PRODUCTS } from "@/contexts/AppContext";
import { toast } from "@/hooks/use-toast";

// Mock data for the account page
const mockUser = {
  name: "John Doe",
  phone: "+91 9876543210",
  email: "john.doe@example.com",
  avatar: null
};

const mockOrders = [
  {
    id: "12345",
    status: "Delivered",
    products: ["Product 1", "Product 2", "Product 3"],
    total: 1250,
    date: "2024-01-15"
  },
  {
    id: "12346",
    status: "Processing",
    products: ["Product A", "Product B"],
    total: 890,
    date: "2024-01-18"
  },
  {
    id: "12347",
    status: "Out for Delivery",
    products: ["Product X"],
    total: 450,
    date: "2024-01-20"
  }
];

const mockCredits = {
  earned: 850,
  redeemed: 300,
  target: 3000,
  history: [
    { type: "earned", amount: 50, description: "Order #12345", date: "2024-01-15" },
    { type: "redeemed", amount: -100, description: "Discount applied", date: "2024-01-10" },
    { type: "earned", amount: 75, description: "Order #12344", date: "2024-01-08" }
  ]
};

const mockAddresses = [
  {
    id: 1,
    line: "123 Green Valley Apartments",
    landmark: "Near City Mall",
    pin: "560001",
    isDefault: true
  },
  {
    id: 2,
    line: "456 Oak Street",
    landmark: "Behind Park",
    pin: "560002",
    isDefault: false
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Processing": return "bg-warning text-white";
    case "Packed": return "bg-primary text-white";
    case "Out for Delivery": return "bg-blue-500 text-white";
    case "Delivered": return "bg-success text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function AccountPage() {
  const { wishlistItems, addToCart } = useApp();
  const [user, setUser] = useState(mockUser);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [notifications, setNotifications] = useState({ sms: true, whatsapp: true });

  const handleCancelOrder = (orderId: string) => {
    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled. 20% credits deducted.",
    });
  };

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    toast({
      title: "Profile Updated Successfully",
      description: "Your profile information has been saved.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const creditsProgress = (mockCredits.earned / mockCredits.target) * 100;

  return (
    <div className="min-h-screen bg-background pb-footer">
      {/* Header with Gradient */}
      <div className="bg-gradient-primary p-6 text-white">
        <div className="container-fresh">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-white/20">
              <AvatarImage src={user.avatar || ""} />
              <AvatarFallback className="bg-white text-primary text-xl font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              <div className="flex items-center gap-2 text-white/90">
                <span>{user.phone}</span>
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={user.phone}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="w-full">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container-fresh py-6 space-y-6">
        {/* Mobile Accordion View */}
        <div className="md:hidden">
          <Accordion type="single" collapsible defaultValue="orders">
            <AccordionItem value="orders" className="border-border">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  My Orders
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <OrdersSection orders={mockOrders} onCancelOrder={handleCancelOrder} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="credits" className="border-border">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-brand-green">💳</span>
                  ecfresh Credits
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <CreditsSection credits={mockCredits} progress={creditsProgress} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="wishlist" className="border-border">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <WishlistSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="addresses" className="border-border">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Saved Addresses
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <AddressesSection addresses={mockAddresses} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="settings" className="border-border">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Profile & Settings
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <SettingsSection 
                  notifications={notifications} 
                  setNotifications={setNotifications}
                  onLogout={handleLogout}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Orders */}
          <div className="lg:col-span-2">
            <Card className="card-fresh">
              <CardHeader className="bg-gradient-primary text-white">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  My Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <OrdersSection orders={mockOrders} onCancelOrder={handleCancelOrder} />
              </CardContent>
            </Card>
          </div>

          {/* Credits */}
          <Card className="card-fresh">
            <CardHeader className="bg-gradient-primary text-white">
              <CardTitle className="flex items-center gap-2">
                <span>💳</span>
                ecfresh Credits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CreditsSection credits={mockCredits} progress={creditsProgress} />
            </CardContent>
          </Card>

          {/* Wishlist */}
          <div className="lg:col-span-2">
            <Card className="card-fresh">
              <CardHeader className="bg-gradient-primary text-white">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <WishlistSection />
              </CardContent>
            </Card>
          </div>

          {/* Addresses & Settings */}
          <div className="space-y-6">
            <Card className="card-fresh">
              <CardHeader className="bg-gradient-primary text-white">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Saved Addresses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <AddressesSection addresses={mockAddresses} />
              </CardContent>
            </Card>

            <Card className="card-fresh">
              <CardHeader className="bg-gradient-primary text-white">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <SettingsSection 
                  notifications={notifications} 
                  setNotifications={setNotifications}
                  onLogout={handleLogout}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Components
function OrdersSection({ orders, onCancelOrder }: { orders: any[], onCancelOrder: (id: string) => void }) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">Order #{order.id}</p>
              <p className="text-sm text-muted-foreground">{order.date}</p>
            </div>
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          </div>
          
          <div className="flex gap-2">
            {order.products.slice(0, 3).map((product: string, idx: number) => (
              <div key={idx} className="w-12 h-12 bg-muted rounded border"></div>
            ))}
            {order.products.length > 3 && (
              <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center text-xs">
                +{order.products.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <p className="font-semibold">₹{order.total}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">View Details</Button>
              {order.status === "Processing" && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onCancelOrder(order.id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CreditsSection({ credits, progress }: { credits: any, progress: number }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">Credits Earned</span>
          <span className="font-semibold">₹{credits.earned}</span>
        </div>
        <Progress value={progress} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">
          At ₹{credits.target} spent, unlock ₹{Math.floor(credits.target * 0.1)} worth of products
        </p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-semibold">Recent Activity</h4>
        {credits.history.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className={item.type === 'earned' ? 'text-success' : 'text-destructive'}>
              {item.type === 'earned' ? '+' : ''}₹{item.amount}
            </span>
            <span className="text-muted-foreground">{item.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WishlistSection() {
  const { wishlistItems, addToCart } = useApp();

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No items in wishlist yet</p>
      </div>
    );
  }

  const wishlistProducts = PRODUCTS.filter(product => wishlistItems.includes(product.id));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {wishlistProducts.map((product) => (
        <div key={product.id} className="border border-border rounded-lg p-3 space-y-2">
          <div className="aspect-square bg-muted rounded"></div>
          <h4 className="font-medium text-sm">{product.name}</h4>
          <p className="font-semibold text-primary">₹{product.variants[0].price}</p>
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => {
              addToCart(product.id, product.variants[0].id, 1);
              toast({ title: "Added to Cart ✅" });
            }}
          >
            Add to Cart
          </Button>
        </div>
      ))}
    </div>
  );
}

function AddressesSection({ addresses }: { addresses: any[] }) {
  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div key={address.id} className="border border-border rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{address.line}</p>
              <p className="text-sm text-muted-foreground">{address.landmark}</p>
              <p className="text-sm text-muted-foreground">PIN: {address.pin}</p>
            </div>
            {address.isDefault && (
              <Badge variant="outline" className="text-xs">Default</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full">+ Add New Address</Button>
    </div>
  );
}

function SettingsSection({ notifications, setNotifications, onLogout }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="font-semibold">Notifications</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm">SMS Updates</span>
          <Switch 
            checked={notifications.sms}
            onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">WhatsApp Updates</span>
          <Switch 
            checked={notifications.whatsapp}
            onCheckedChange={(checked) => setNotifications({...notifications, whatsapp: checked})}
          />
        </div>
      </div>
      
      <div className="border-t pt-4">
        <Button 
          variant="outline" 
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}