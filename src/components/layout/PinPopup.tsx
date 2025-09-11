import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

interface PinPopupProps {
  isOpen: boolean;
  onPinConfirm: (pin: string) => void;
}

const SUPPORTED_PINS = [
  "682001", "682002", "682003", "682004", "682005", "682006", "682007", "682008", 
  "682009", "682010", "682011", "682012", "682013", "682014", "682015", "682016",
  "682017", "682018", "682019", "682020", "682021", "682022", "682023", "682024",
  "682025", "682026", "682027", "682028", "682029", "682030", "682031", "682032"
];

export default function PinPopup({ isOpen, onPinConfirm }: PinPopupProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handlePinChange = (value: string) => {
    setPin(value);
    setError("");
    
    if (value.length >= 3) {
      const filtered = SUPPORTED_PINS.filter(p => p.startsWith(value));
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleConfirm = () => {
    if (!pin) {
      setError("Please enter your PIN code");
      return;
    }
    
    if (!SUPPORTED_PINS.includes(pin)) {
      setError("Sorry, we're not in this area yet. Leave your PIN and we'll notify you soon.");
      return;
    }
    
    localStorage.setItem("ecfresh-pin", pin);
    onPinConfirm(pin);
  };

  const handleSuggestionClick = (selectedPin: string) => {
    setPin(selectedPin);
    setSuggestions([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md mx-4"  onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-poppins gradient-text">
            Where should we deliver?
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            Enter your PIN code to check if we deliver in your area
          </p>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Enter your PIN code"
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              className="pl-10 h-12 rounded-button"
              maxLength={6}
            />
            
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-lg mt-1 shadow-card z-10">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span className="font-medium">{suggestion}</span>
                    <span className="text-muted-foreground ml-2">- Kochi</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {error && (
            <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleConfirm}
            className="w-full h-12 btn-pill btn-gradient text-white font-semibold"
            disabled={!pin}
          >
            Confirm Location
          </Button>
        </div>
        
        <div className="text-center text-xs text-muted-foreground mt-4">
          Serving fresh vegetables across Kochi
        </div>
      </DialogContent>
    </Dialog>
  );
}