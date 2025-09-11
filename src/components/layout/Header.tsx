import { MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  selectedPin: string;
  onPinChange: () => void;
}

export default function Header({ selectedPin, onPinChange }: HeaderProps) {
  return (
    <header className="sticky-header h-header">
      <div className="container-fresh h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-poppins font-bold gradient-text">
            ecfresh
          </h1>
        </div>
        
        {/* Location Chip */}
        <Button
          onClick={onPinChange}
          variant="outline"
          className="btn-outline-fresh h-10 rounded-button flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          <span className="font-medium">{selectedPin}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}