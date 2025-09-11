import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  nutritionalInfo?: string;
  storageInfo?: string;
  recipeIdeas?: string[];
}

export interface ProductVariant {
  id: string;
  size: string;
  weight: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

interface AppContextType {
  // Cart
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateCartQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist
  wishlistItems: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // User
  user: any;
  isLoggedIn: boolean;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ecfresh-cart");
    const savedWishlist = localStorage.getItem("ecfresh-wishlist");
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage");
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist from localStorage");
      }
    }
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("ecfresh-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Save to localStorage when wishlist changes
  useEffect(() => {
    localStorage.setItem("ecfresh-wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (productId: string, variantId: string, quantity = 1) => {
    const product = PRODUCTS.find(p => p.id === productId);
    const variant = product?.variants.find(v => v.id === variantId);
    
    if (!product || !variant) return;

    setCartItems(current => {
      const existingItem = current.find(
        item => item.productId === productId && item.variantId === variantId
      );

      if (existingItem) {
        return current.map(item =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...current, { productId, variantId, quantity, product, variant }];
    });
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCartItems(current =>
      current.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      )
    );
  };

  const updateCartQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCartItems(current =>
      current.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlistItems(current =>
      current.includes(productId)
        ? current.filter(id => id !== productId)
        : [...current, productId]
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isLoggedIn = !!user;

  return (
    <AppContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        user,
        isLoggedIn,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Mock Products Database
export const PRODUCTS: Product[] = [
  {
    id: "carrot-julienne",
    name: "Carrot Julienne Cut",
    description: "Fresh carrots cut into perfect julienne strips, ready for stir-fries and salads",
    category: "curry-cuts",
    images: ["/api/placeholder/400/400", "/api/placeholder/400/400"],
    variants: [
      { id: "300g", size: "Small", weight: "300g", price: 60, originalPrice: 80, inStock: true },
      { id: "500g", size: "Medium", weight: "500g", price: 95, inStock: true },
      { id: "1kg", size: "Large", weight: "1kg", price: 180, inStock: true },
    ],
    tags: ["Fresh", "Ready to Cook"],
    inStock: true,
    rating: 4.5,
    reviews: 127,
    nutritionalInfo: "Rich in Vitamin A, fiber, and antioxidants",
    storageInfo: "Store in refrigerator for up to 5 days",
    recipeIdeas: ["Carrot Stir Fry", "Mixed Vegetable Curry", "Fresh Garden Salad"]
  },
  {
    id: "mixed-fruit-salad",
    name: "Mixed Fruit Salad",
    description: "Fresh seasonal fruits cut and mixed, perfect for healthy snacking",
    category: "cut-fruits",
    images: ["/api/placeholder/400/400", "/api/placeholder/400/400"],
    variants: [
      { id: "250g", size: "Small", weight: "250g", price: 120, inStock: true },
      { id: "500g", size: "Medium", weight: "500g", price: 220, inStock: true },
      { id: "750g", size: "Large", weight: "750g", price: 320, inStock: true },
    ],
    tags: ["Popular", "Healthy"],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    nutritionalInfo: "High in vitamins, minerals, and natural sugars",
    storageInfo: "Consume within 24 hours for best freshness"
  },
  {
    id: "onion-diced",
    name: "Onion Diced Cut",
    description: "Perfectly diced onions, saves your time and tears",
    category: "curry-cuts",
    images: ["/api/placeholder/400/400"],
    variants: [
      { id: "250g", size: "Small", weight: "250g", price: 45, originalPrice: 55, inStock: true },
      { id: "500g", size: "Medium", weight: "500g", price: 80, inStock: true },
      { id: "1kg", size: "Large", weight: "1kg", price: 150, inStock: true },
    ],
    tags: ["Essential", "Time Saver"],
    inStock: true,
    rating: 4.3,
    reviews: 156
  },
  {
    id: "cucumber-slices",
    name: "Cucumber Slices",
    description: "Fresh cucumber slices, perfect for salads and sandwiches",
    category: "salads",
    images: ["/api/placeholder/400/400"],
    variants: [
      { id: "200g", size: "Small", weight: "200g", price: 35, inStock: false },
      { id: "400g", size: "Medium", weight: "400g", price: 65, inStock: true },
    ],
    tags: ["Quick", "Fresh"],
    inStock: false,
    rating: 4.2,
    reviews: 67
  },
  {
    id: "tomato-wedges",
    name: "Tomato Wedges",
    description: "Fresh tomatoes cut into perfect wedges for cooking",
    category: "curry-cuts",
    images: ["/api/placeholder/400/400"],
    variants: [
      { id: "300g", size: "Small", weight: "300g", price: 55, inStock: true },
      { id: "500g", size: "Medium", weight: "500g", price: 90, inStock: true },
    ],
    tags: ["Fresh", "Versatile"],
    inStock: true,
    rating: 4.4,
    reviews: 98
  },
  {
    id: "spinach-leaves",
    name: "Fresh Spinach Leaves",
    description: "Clean, fresh spinach leaves ready for cooking",
    category: "fresh-vegetables",
    images: ["/api/placeholder/400/400"],
    variants: [
      { id: "250g", size: "Small", weight: "250g", price: 40, inStock: true },
      { id: "500g", size: "Medium", weight: "500g", price: 75, inStock: true },
    ],
    tags: ["Organic", "Iron Rich"],
    inStock: true,
    rating: 4.6,
    reviews: 134
  }
];

export const CATEGORIES = [
  { id: "curry-cuts", name: "Curry Cuts", icon: "🍛", image: "/api/placeholder/120/120", count: 24 },
  { id: "cut-fruits", name: "Cut Fruits", icon: "🍎", image: "/api/placeholder/120/120", count: 18 },
  { id: "fresh-vegetables", name: "Fresh Vegetables", icon: "🥬", image: "/api/placeholder/120/120", count: 45 },
  { id: "juice-cuts", name: "Juice Cuts", icon: "🧃", image: "/api/placeholder/120/120", count: 12 },
  { id: "mezhukkupuratti", name: "Mezhukkupuratti Cut", icon: "🥒", image: "/api/placeholder/120/120", count: 15 },
  { id: "peeled-items", name: "Peeled Items", icon: "🥔", image: "/api/placeholder/120/120", count: 20 },
  { id: "salads", name: "Salads", icon: "🥗", image: "/api/placeholder/120/120", count: 16 },
  { id: "fresh-fruits", name: "Fresh Fruits", icon: "🍊", image: "/api/placeholder/120/120", count: 28 },
  { id: "grated-items", name: "Grated Items", icon: "🧀", image: "/api/placeholder/120/120", count: 8 },
  { id: "grocery", name: "Grocery", icon: "🛒", image: "/api/placeholder/120/120", count: 52 },
  { id: "thoran-cut", name: "Thoran Cut", icon: "🌿", image: "/api/placeholder/120/120", count: 14 },
];