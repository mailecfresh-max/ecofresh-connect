import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

const DEMO_SLIDES: BannerSlide[] = [
  {
    id: "1",
    image: "/api/placeholder/800/200",
    title: "Fresh Cut Vegetables",
    subtitle: "Ready to cook, delivered fresh to your doorstep",
    cta: "Shop Now"
  },
  {
    id: "2", 
    image: "/api/placeholder/800/200",
    title: "Fruit Cuts & Salads",
    subtitle: "Healthy, fresh, and perfectly portioned",
    cta: "Order Today"
  },
  {
    id: "3",
    image: "/api/placeholder/800/200", 
    title: "Daily Essentials",
    subtitle: "From curry cuts to grated items, we've got you covered",
    cta: "Explore"
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length);
  };

  return (
    <div className="hero-banner bg-gradient-hero relative overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {DEMO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="h-full bg-gradient-hero flex items-center justify-between px-8">
              <div className="flex-1 text-white">
                <h2 className="text-2xl md:text-4xl font-poppins font-bold mb-2">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl mb-6 text-white/90">
                  {slide.subtitle}
                </p>
                <Button className="btn-pill bg-white text-primary hover:bg-white/90 font-semibold px-8">
                  {slide.cta}
                </Button>
              </div>
              <div className="hidden md:block flex-1 text-right">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-4xl">🥕</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {DEMO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}