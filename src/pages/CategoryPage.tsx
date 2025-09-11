import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp, PRODUCTS, CATEGORIES } from "@/contexts/AppContext";
import ProductCard from "@/components/products/ProductCard";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useApp();
  
  const [sortBy, setSortBy] = useState("popularity");
  const [localSearch, setLocalSearch] = useState("");

  const category = CATEGORIES.find(c => c.id === categoryId);
  const categoryProducts = PRODUCTS.filter(p => p.category === categoryId);

  // Filter and sort products
  const filteredProducts = categoryProducts.filter(product =>
    product.name.toLowerCase().includes(localSearch.toLowerCase()) ||
    product.description.toLowerCase().includes(localSearch.toLowerCase()) ||
    product.tags.some(tag => tag.toLowerCase().includes(localSearch.toLowerCase()))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Math.min(...a.variants.map(v => v.price)) - Math.min(...b.variants.map(v => v.price));
      case "price-high":
        return Math.min(...b.variants.map(v => v.price)) - Math.min(...a.variants.map(v => v.price));
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default: // popularity
        return b.reviews - a.reviews;
    }
  });

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-poppins font-semibold mb-4">Category not found</h2>
          <Button onClick={() => navigate("/")} className="btn-pill btn-gradient">
            Go Home
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
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span>
            <span className="font-semibold">{category.name}</span>
          </div>
          
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container-fresh space-y-6 py-6">
        {/* Category Header */}
        <div className="text-center">
          <h1 className="text-2xl font-poppins font-bold mb-2">{category.name}</h1>
          <p className="text-muted-foreground">
            Fresh, quality {category.name.toLowerCase()} delivered to your doorstep
          </p>
          <div className="text-sm text-muted-foreground mt-1">
            {sortedProducts.length} products available
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={`Search in ${category.name}...`}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 h-12 rounded-button"
            />
          </div>

          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1 h-10 rounded-button">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid-products">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or browse other categories
            </p>
            <Button 
              onClick={() => setLocalSearch("")}
              variant="outline"
              className="rounded-button"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}