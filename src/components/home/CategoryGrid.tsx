import { CATEGORIES } from "@/contexts/AppContext";

interface CategoryGridProps {
  onCategoryClick: (categoryId: string) => void;
}

export default function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-poppins font-semibold">Shop by Category</h2>
        <span className="text-sm text-muted-foreground">{CATEGORIES.length} categories</span>
      </div>
      
      <div className="grid-categories">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className="card-fresh p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 group"
          >
            {/* Category Icon/Image */}
            <div className="relative mb-3">
              <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div className="absolute -top-1 -right-1 bg-brand-orange text-white text-xs px-2 py-1 rounded-full font-medium">
                {category.count}
              </div>
            </div>
            
            {/* Category Name */}
            <h3 className="font-medium text-sm text-center leading-tight">
              {category.name}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
}